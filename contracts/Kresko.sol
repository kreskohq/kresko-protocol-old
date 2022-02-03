//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./interfaces/IAMM.sol";
import "./interfaces/IOracle.sol";
import "./interfaces/IKAsset.sol";
import "./interfaces/IReserve.sol";

import "./libraries/CeloRegistry.sol";
import "./libraries/DecimalMath.sol";

contract Kresko is Ownable {
  using DecimalMath for uint256;

  struct KAssetInfo {
    IAMM amm;
    IReserve reserve;
    IOracle oracle;
    // Decimal value, ie has 18 decimals
    uint256 collateralRatio;
    bool active;
  }

  struct PercentOwnershipInfo {
    uint256 initialPercentageOwned;
    uint256 ledgerIndex;
  }

  /**
   * @notice The minimum amount of shares.
   */
  uint256 public constant MINIMUM_SHARE = 1000;

  /**
   * @notice A mapping of kAsset address to its corresponding info.
   */
  mapping(address => KAssetInfo) public kAssetInfos;

  /**
   * @notice A mapping of kAsset address to a mapping of user address to
   * the amount of the kAsset the user owes.
   * @dev This includes all kAssets in existence, even those that were supplied
   * as AMM liquidity.
   */
  mapping(address => mapping(address => uint256)) public kAssetDebt;

  /**
   * @notice A mapping of kAsset address to a mapping of user address to
   * the amount of kAsset LP shares the user owns in the kAsset's AMM.
   */
  mapping(address => mapping(address => uint256)) public kAssetLPShareBalances;
  /**
   * @notice A mapping of kAsset address to the total supply of kAsset LP shares
   * in the kAsset's AMM.
   */
  mapping(address => uint256) public kAssetLPShareTotalSupply;

  /**
   * @notice A mapping of kAsset address to a mapping of user address to
   * the amount of collateral shares the user owns between the kAsset's AMM
   * and reserve.
   */
  mapping(address => mapping(address => uint256))
    public collateralShareBalances;
  /**
   * @notice A mapping of kAsset address to the total supply of collateral
   * shares corresponding to collateral in the kAsset's AMM and reserve.
   */
  mapping(address => uint256) public collateralShareTotalSupply;

  /**
   * @notice StableToken, ie cUSD.
   */
  IERC20 public stableToken;

  /**
   * @notice Requires the kAsset to be registered with this contract.
   * Permits the kAsset to not be active.
   * @param kAsset The address of the kAsset.
   */
  modifier kAssetExists(address kAsset) {
    require(
      address(kAssetInfos[kAsset].reserve) != address(0),
      "Kresko: kAsset does not exist"
    );
    _;
  }

  /**
   * @notice Requires the kAsset to be registered with this contract and active.
   * @param kAsset The address of the kAsset.
   */
  modifier kAssetIsActive(address kAsset) {
    require(kAssetInfos[kAsset].active, "Kresko: kAsset not active");
    _;
  }

  /**
   * @param stableToken_ The address of StableToken, ie cUSD.
   */
  constructor(address stableToken_) {
    stableToken = IERC20(stableToken_);
  }

  /**
   * @notice Registers a kAsset and its related functions with this contract. Activates
   * the kAsset for use.
   * @param kAsset The address of the kAsset.
   * @param amm The address of the AMM for the kAsset.
   * @param reserve The address of the reserve for the kAsset.
   * @param oracle The address of the oracle for the kAsset price.
   * @param collateralRatio A decimal value (ie 18 decimals) that is the required
   * ratio of collateral : kAsset value minted a user must maintain. Must be > 1e18
   * (1 with 18 decimals).
   */
  function listKAsset(
    address kAsset,
    address amm,
    address reserve,
    address oracle,
    uint256 collateralRatio
  ) external onlyOwner {
    require(collateralRatio >= 1e18, "Kresko: collateral ratio too low");
    kAssetInfos[kAsset] = KAssetInfo({
      amm: IAMM(amm),
      reserve: IReserve(reserve),
      oracle: IOracle(oracle),
      collateralRatio: collateralRatio,
      active: true
    });
  }

  /**
   * @notice Mints a kAsset to the sender given they own sufficient collateral in
   * the protocol.
   * @dev kAsset must be active.
   * @param kAsset The address of the kAsset.
   * @param amount The amount of the kAsset to mint.
   */
  function mint(address kAsset, uint256 amount)
    external
    kAssetIsActive(kAsset)
  {
    // Ensure msg.sender has enough total collateral to cover this mint
    // on top of any existing debt
    uint256 newKAssetDebt = kAssetDebt[address(kAsset)][msg.sender] + amount;
    require(
      _isProperlyCollateralized(kAsset, msg.sender, newKAssetDebt),
      "Kresko: not enough collateral"
    );
    // Update debt the sender owes
    kAssetDebt[address(kAsset)][msg.sender] = newKAssetDebt;
    // Mint the kAsset to the sender
    IKAsset(kAsset).mint(msg.sender, amount);
  }

  /**
   * @notice Mints a kAsset given the sender owns sufficient collateral in the protocol.
   * Rather than sending the kAsset to the sender, the kAsset is supplied as liquidity
   * to the kAsset's AMM, and the sender is recorded as owning the appropriate share
   * of kAssets in the AMM.
   * @dev kAsset must be active.
   * @param kAsset The address of the kAsset.
   * @param amount The amount of the kAsset to mint.
   */
  function mintAsAMMLiquidity(address kAsset, uint256 amount)
    external
    kAssetIsActive(kAsset)
  {
    // Ensure msg.sender has enough total collateral to cover this mint
    // on top of any existing debt
    uint256 newKAssetDebt = kAssetDebt[address(kAsset)][msg.sender] + amount;
    require(
      _isProperlyCollateralized(kAsset, msg.sender, newKAssetDebt),
      "Kresko: not enough collateral"
    );
    // Update debt the sender owes
    kAssetDebt[address(kAsset)][msg.sender] = newKAssetDebt;
    // Record the sender as owning the appropriate amount of shares
    // of kAssets in the AMM
    _mintKAssetLPShares(kAsset, amount);
    KAssetInfo memory kAssetInfo = kAssetInfos[kAsset];
    // Mint the kAsset to the AMM
    IKAsset(kAsset).mint(address(kAssetInfo.amm), amount);
    // Move over the appropriate amount of StableToken from the reserve
    kAssetInfo.reserve.transferStableTokenToAMM(
      amount.multiplyDecimalRound(kAssetInfo.oracle.value())
    );
    // Call addLiquidity to have the AMM realize there has been liquidity deposited
    kAssetInfo.amm.addLiquidity();
  }

  /**
   * @notice Deposits collateral from the sender into a kAsset's reserves.
   * @dev kAsset must exist.
   * @param kAsset The address of the kAsset.
   * @param amount The amount of StableToken to deposit.
   */
  function depositCollateral(address kAsset, uint256 amount)
    external
    kAssetExists(kAsset)
  {
    _mintCollateralShares(kAsset, amount);
    require(
      stableToken.transferFrom(
        msg.sender,
        address(kAssetInfos[kAsset].reserve),
        amount
      ),
      "Kresko: reserve transfer failed"
    );
  }

  /**
   * @notice Gets the total amount of StableToken collateral for a kAsset
   * found in the kAsset's AMM and reserve.
   * @dev kAsset must exist.
   * @param kAsset The address of the kAsset.
   * @return The amount of StableToken collateral in the kAsset's AMM and reserve.
   */
  function getTotalCollateralAmount(address kAsset)
    public
    view
    kAssetExists(kAsset)
    returns (uint256)
  {
    return
      stableToken.balanceOf(address(kAssetInfos[kAsset].amm)) +
      stableToken.balanceOf(address(kAssetInfos[kAsset].reserve));
  }

  /**
   * @notice Gets the amount of kAsset an account owns in the kAsset AMM.
   * @dev kAsset must exist.
   * @param kAsset The address of the kAsset.
   * @param account The address of the account.
   * @return The amount of the kAsset the account owns in the kAsset AMM.
   */
  function getKAssetAmountOwned(address kAsset, address account)
    public
    view
    kAssetExists(kAsset)
    returns (uint256)
  {
    return
      _getAssetAmountOwnedFromShares(
        kAssetLPShareBalances[kAsset][account],
        kAssetLPShareTotalSupply[kAsset],
        kAssetInfos[kAsset].amm.kAssetBucket()
      );
  }

  /**
   * @notice Gets the amount of StableToken collateral an account owns in
   * the kAsset's AMM and reserve.
   * @dev kAsset must exist.
   * @param kAsset The address of the kAsset.
   * @param account The address of the account.
   * @return The amount of StableToken collateral the account owns in the kAsset's
   * AMM and reserve.
   */
  function getCollateralAmountOwned(address kAsset, address account)
    public
    view
    kAssetExists(kAsset)
    returns (uint256)
  {
    return
      _getAssetAmountOwnedFromShares(
        collateralShareBalances[kAsset][account],
        collateralShareTotalSupply[kAsset],
        getTotalCollateralAmount(kAsset)
      );
  }

  /**
   * @notice Gets the amount of an asset a hypothetical account would own from
   * totalAssetAmount given information on shares owned.
   * @param shareBalance The amount of shares the hypothetical account owns.
   * @param shareTotalSupply The total supply of shares.
   * @param totalAssetAmount The total amount of the asset that the shares correspond to.
   * @return The amount of assets from totalAssetAmount the shares would own.
   */
  function _getAssetAmountOwnedFromShares(
    uint256 shareBalance,
    uint256 shareTotalSupply,
    uint256 totalAssetAmount
  ) internal pure returns (uint256) {
    if (shareBalance == 0 || shareTotalSupply == 0) {
      return 0;
    }
    return (shareBalance * totalAssetAmount) / shareTotalSupply;
  }

  /**
   * @notice Creates kAsset LP shares for the sender given the amount of kAsset
   * they are adding to the AMM.
   * @dev Should be called by a function ensuring kAsset exists.
   * @param kAsset The address of the kAsset.
   * @param kAssetAmountIn The amount of kAsset the sender is adding as liquidity to the AMM.
   */
  function _mintKAssetLPShares(address kAsset, uint256 kAssetAmountIn)
    internal
  {
    (uint256 shareAddAmount, uint256 shareSupplyAddAmount) =
      _getShareAddAmountAndSupplyAddAmount(
        kAssetAmountIn,
        // intentionally use the cached bucket to avoid any "donations" to the
        // AMM messing things up
        kAssetInfos[kAsset].amm.kAssetBucket(),
        kAssetLPShareTotalSupply[kAsset]
      );
    kAssetLPShareTotalSupply[kAsset] += shareSupplyAddAmount;
    kAssetLPShareBalances[kAsset][msg.sender] += shareAddAmount;
  }

  /**
   * @notice Creates collateral shares for the sender given the amount of collateral
   * they are depositing.
   * @dev Should be called by a function ensuring kAsset exists.
   * @param kAsset The address of the kAsset.
   * @param collateralAmountIn The amount of StableToken collateral the sender is
   * depositing.
   */
  function _mintCollateralShares(address kAsset, uint256 collateralAmountIn)
    internal
  {
    (uint256 shareAddAmount, uint256 shareSupplyAddAmount) =
      _getShareAddAmountAndSupplyAddAmount(
        collateralAmountIn,
        getTotalCollateralAmount(kAsset),
        collateralShareTotalSupply[kAsset]
      );
    collateralShareTotalSupply[kAsset] += shareSupplyAddAmount;
    collateralShareBalances[kAsset][msg.sender] += shareAddAmount;
  }

  /**
   * @notice Provided the amount of an asset being added, calculates the amount of
   * shares to grant, and the amount to increase the total supply of shares.
   * @dev The amount to increase the total supply of shares is only different when
   * the initial liquidity is added.
   * @param assetAmountIn The amount of the asset being added.
   * @param existingAssetAmount The amount of the assets that are already deposited
   * and are owned by existing shares.
   * @param shareTotalSupply The existing total supply of shares.
   * @return The amount of shares to grant, and the amount to increase the total supply
   * of shares.
   */
  function _getShareAddAmountAndSupplyAddAmount(
    uint256 assetAmountIn,
    uint256 existingAssetAmount,
    uint256 shareTotalSupply
  ) internal pure returns (uint256, uint256) {
    uint256 shareAddAmount;
    uint256 shareSupplyAddAmount;
    if (shareTotalSupply == 0) {
      // See UniswapV2Pair's rationale for their MINIMUM_LIQUIDITY
      shareAddAmount = assetAmountIn - MINIMUM_SHARE;
      shareSupplyAddAmount = assetAmountIn;
    } else {
      shareAddAmount = shareSupplyAddAmount =
        (assetAmountIn * shareTotalSupply) /
        existingAssetAmount;
    }
    return (shareAddAmount, shareSupplyAddAmount);
  }

  /**
   * @notice Determines if the account would be properly collateralized with the
   * provided kAsset debt.
   * @param kAsset The address of the kAsset.
   * @param account The address of the account.
   * @param accountKAssetDebt The hypothetical amount of kAsset debt to test the
   * account's collateral against.
   * @return Whether the account's collateral for the kAsset is sufficient to cover
   * the accountKAssetDebt.
   */
  function _isProperlyCollateralized(
    address kAsset,
    address account,
    uint256 accountKAssetDebt
  ) internal returns (bool) {
    KAssetInfo memory kAssetInfo = kAssetInfos[kAsset];
    uint256 requiredCollateralAmount =
      accountKAssetDebt
        .multiplyDecimalRound(kAssetInfo.oracle.value())
        .multiplyDecimalRound(kAssetInfo.collateralRatio);
    uint256 collateralAmountOwned = getCollateralAmountOwned(kAsset, account);
    return requiredCollateralAmount <= collateralAmountOwned;
  }
}
