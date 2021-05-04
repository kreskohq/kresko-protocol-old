//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IOracle.sol";

import "./libraries/CeloRegistry.sol";
import "./libraries/DecimalMath.sol";

contract Kresko is Ownable {
  using DecimalMath for uint256;

  struct KAssetInfo {
    address amm;
    address reserve;
    bool active;
  }

  struct PercentOwnershipInfo {
    uint256 initialPercentageOwned;
    uint256 ledgerIndex;
  }

  /**
   * @notice A mapping of kAsset address to its corresponding info.
   */
  mapping(address => KAssetInfo) public kAssetInfos;

  /**
   * @notice A mapping of kAsset address to a mapping of user address to
   * info on the user's ownership of the collateral for the particular kAsset.
   */
  mapping(address => mapping(address => PercentOwnershipInfo))
    public collateralPercentOwnershipInfos;

  /**
   * @notice A history of the amount of collateral for each deposit / withdrawal of collateral.
   * @dev the uint value is a precise decimal intended for use with DecimalMath.
   */
  mapping(address => uint256[]) public collateralLedgers;

  modifier kAssetExists(address kAsset) {
    require(
      kAssetInfos[kAsset].reserve != address(0),
      "Kresko: kAsset does not exist"
    );
    _;
  }

  modifier kAssetIsActive(address kAsset) {
    require(kAssetInfos[kAsset].active, "Kresko: kAsset not active");
    _;
  }

  function listKAsset(
    address kAsset,
    address amm,
    address reserve
  ) external onlyOwner {
    kAssetInfos[kAsset] = KAssetInfo({
      amm: amm,
      reserve: reserve,
      active: true
    });
  }

  function depositCollateral(address kAsset, uint256 amount)
    external
    kAssetExists(kAsset)
  {
    require(
      CeloRegistry.getStableToken().transferFrom(
        msg.sender,
        kAssetInfos[kAsset].reserve,
        amount
      ),
      "Kresko: reserve transfer failed"
    );
    uint256 existingCollateralAmountOwned =
      getCollateralAmountOwned(kAsset, msg.sender);
    _recordChangeInCollateralLedger(
      kAsset,
      amount,
      existingCollateralAmountOwned,
      true
    );
  }

  function getTotalCollateralAmount(address kAsset)
    public
    view
    kAssetExists(kAsset)
    returns (uint256)
  {
    IERC20 stableToken = CeloRegistry.getStableToken();
    return
      stableToken.balanceOf(kAssetInfos[kAsset].amm) +
      stableToken.balanceOf(kAssetInfos[kAsset].reserve);
  }

  function getCollateralAmountOwned(address kAsset, address account)
    public
    view
    kAssetExists(kAsset)
    returns (uint256)
  {
    // Get the ownership info for the account
    PercentOwnershipInfo memory percentOwnershipInfo =
      collateralPercentOwnershipInfos[kAsset][account];
    // If the account doesn't own any collateral, return 0
    if (percentOwnershipInfo.initialPercentageOwned == 0) {
      return 0;
    }
    uint256[] storage collateralLedger = collateralLedgers[kAsset];
    // Equal to initialPercentageOwned *
    //	(most recent ledger value / ledger value when initialPercentageOwned was valid)
    uint256 percentageOwned =
      percentOwnershipInfo.initialPercentageOwned.multiplyDecimalRoundPrecise(
        collateralLedger[collateralLedgers[kAsset].length - 1]
          .divideDecimalRoundPrecise(
          collateralLedger[percentOwnershipInfo.ledgerIndex]
        )
      );
    // Note that preciseDecimalToDecimal() only makes sense because
    // stable token has 18 decimals and decimal has 18 decimals.
    return
      percentageOwned
        .multiplyDecimalRound(getTotalCollateralAmount(kAsset))
        .preciseDecimalToDecimal();
  }

  function _recordChangeInCollateralLedger(
    address kAsset,
    uint256 amount,
    uint256 existingMsgSenderCollateral,
    bool addingCollateral
  ) internal {
    // The total collateral amount before adding this new collateral
    uint256 existingTotalCollateralAmount = getTotalCollateralAmount(kAsset);
    // The total collateral amount after adding this new collateral
    uint256 newTotalCollateralAmount =
      addingCollateral
        ? existingTotalCollateralAmount + amount
        : existingTotalCollateralAmount - amount;

    // High precision decimal.
    // Used to multiply by previous collateral percentage ownership to calculate
    // the new ownership percentage.
    uint256 totalCollateralChangeFactor =
      existingTotalCollateralAmount.divideDecimalRoundPrecise(
        newTotalCollateralAmount
      );

    uint256 newMsgSenderCollateralAmount =
      addingCollateral
        ? existingMsgSenderCollateral + amount
        : existingMsgSenderCollateral - amount;
    // High precision decimal.
    // This is the percent of the total collateral that amount corresponds to.
    uint256 newMsgSenderCollateralPercentage =
      (newMsgSenderCollateralAmount).divideDecimalRoundPrecise(
        newTotalCollateralAmount
      );

    uint256[] storage collateralLedger = collateralLedgers[kAsset];

    // Record the new percentage owned
    collateralPercentOwnershipInfos[kAsset][msg.sender]
      .initialPercentageOwned = newMsgSenderCollateralPercentage;
    // Record the index of the ledger the above collateral percentage was taken at
    collateralPercentOwnershipInfos[kAsset][msg.sender]
      .ledgerIndex = collateralLedger.length;

    // If this isn't the first collateral deposit ever for the kAsset,
    // record the effect of totalCollateralChangeFactor into the ledger
    if (collateralLedger.length > 0) {
      collateralLedger.push(
        collateralLedger[collateralLedger.length - 1]
          .multiplyDecimalRoundPrecise(totalCollateralChangeFactor)
      );
    } else {
      // If this is the first collateral for the kAsset, set the first value to 1
      collateralLedger.push(DecimalMath.preciseUnit());
    }
  }
}
