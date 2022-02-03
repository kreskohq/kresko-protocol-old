//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./libraries/DecimalMath.sol";
import "./libraries/UniswapMath.sol";

import "./interfaces/IOracle.sol";
import "./interfaces/IReserve.sol";

contract AMM is Ownable {
  using DecimalMath for uint256;

  address public kresko;
  IOracle public oracle;
  IReserve public reserve;

  address public stableTokenAddress;
  address public kAssetAddress;
  IERC20 private stableToken;
  IERC20 private kAsset;

  uint256 public stableTokenBucket;
  uint256 public kAssetBucket;

  // block.timestamp of the last bucket update
  uint256 public lastBucketUpdateTimestamp;
  // In seconds
  uint256 public minTimeBetweenBucketUpdates;

  event SetReserve(address reserve);
  event SetOracle(address oracle);
  event SetMinTimeBetweenBucketUpdates(uint256 minTimeBetweenBucketUpdates);
  event StableTokenBucketUpdated(
    uint256 kAssetBucket,
    uint256 stableTokenBucket
  );

  modifier onlyKresko() {
    require(msg.sender == kresko, "AMM: sender not Kresko");
    _;
  }

  constructor(
    address kresko_,
    address oracle_,
    address stableTokenAddress_,
    address kAssetAddress_,
    uint256 minTimeBetweenBucketUpdates_
  ) {
    kresko = kresko_;
    stableTokenAddress = stableTokenAddress_;
    kAssetAddress = kAssetAddress_;
    stableToken = IERC20(stableTokenAddress);
    kAsset = IERC20(kAssetAddress);

    _setOracle(oracle_);
    _setMinTimeBetweenBucketUpdates(minTimeBetweenBucketUpdates_);
  }

  function addLiquidity() public onlyKresko {
    stableTokenBucket = stableToken.balanceOf(address(this));
    kAssetBucket = kAsset.balanceOf(address(this));
  }

  function swap(uint256 amount, address fromToken) public {
    require(amount > 0, "Kresko: Invalid swap value");
    require(
      fromToken == stableTokenAddress || fromToken == kAssetAddress,
      "Kresko: Invalid swap token"
    );
    updateStableTokenBucketIfNeeded();

    uint256 stableBalance = stableToken.balanceOf(address(this));
    uint256 kAssetBalance = kAsset.balanceOf(address(this));

    IERC20 from;
    IERC20 to;
    uint256 amountOut;
    if (fromToken == stableTokenAddress) {
      from = stableToken;
      to = kAsset;
      amountOut = UniswapMath.getAmountOut(
        amount,
        stableBalance,
        kAssetBalance
      );
      stableTokenBucket = stableBalance + amount;
      kAssetBucket = kAssetBalance - amountOut;
    } else {
      from = kAsset;
      to = stableToken;
      amountOut = UniswapMath.getAmountOut(
        amount,
        kAssetBalance,
        stableBalance
      );
      kAssetBucket = kAssetBalance + amount;
      stableTokenBucket = stableBalance - amountOut;
    }

    require(
      from.transferFrom(msg.sender, address(this), amount),
      "Kresko: Funds not approved"
    );
    to.transfer(msg.sender, amountOut);
  }

  function updateStableTokenBucketIfNeeded() public {
    if (
      // solhint-disable-next-line not-rely-on-time
      block.timestamp - lastBucketUpdateTimestamp > minTimeBetweenBucketUpdates
    ) {
      _updateStableTokenBucket();
      // solhint-disable-next-line not-rely-on-time
      lastBucketUpdateTimestamp = block.timestamp;
    }
  }

  // TODO: consider having stable token bucket as "logical" to avoid the gas cost
  // of a transfer here. May be hard with relying upon balances so much though.
  function _updateStableTokenBucket() internal {
    require(address(reserve) != address(0), "AMM: reserve not set");
    uint256 oldStableTokenBucket = stableTokenBucket;
    uint256 newStableTokenBucket = getUpdatedStableTokenBucket();
    if (newStableTokenBucket > oldStableTokenBucket) {
      reserve.transferStableTokenToAMM(
        newStableTokenBucket - oldStableTokenBucket
      );
    } else {
      require(
        stableToken.transfer(
          address(reserve),
          oldStableTokenBucket - newStableTokenBucket
        ),
        "AMM: transfer to reserve failed"
      );
    }
    emit StableTokenBucketUpdated(kAssetBucket, stableTokenBucket);
  }

  function getUpdatedStableTokenBucket() public view returns (uint256) {
    return kAssetBucket.multiplyDecimalRound(oracle.value());
  }

  function setReserve(address reserve_) external onlyOwner {
    require(address(reserve) == address(0), "AMM: Reserve already set");
    reserve = IReserve(reserve_);
    emit SetReserve(reserve_);
  }

  function setOracle(address newOracle) external onlyOwner {
    _setOracle(newOracle);
  }

  function _setOracle(address newOracle) internal {
    oracle = IOracle(newOracle);
    emit SetOracle(newOracle);
  }

  function setMinTimeBetweenBucketUpdates(
    uint256 newMinTimeBetweenBucketUpdates
  ) external onlyOwner {
    _setMinTimeBetweenBucketUpdates(newMinTimeBetweenBucketUpdates);
  }

  function _setMinTimeBetweenBucketUpdates(
    uint256 newMinTimeBetweenBucketUpdates
  ) internal {
    minTimeBetweenBucketUpdates = newMinTimeBetweenBucketUpdates;
    emit SetMinTimeBetweenBucketUpdates(newMinTimeBetweenBucketUpdates);
  }

  // ===============
  // NOTE - THIS IS JUST SO WE CAN EASILY REMOVE LIQUIDITY FOR NEW TESTNET DEPLOYMENTS
  // THIS MUST MUST MUST BE REMOVED IN THE FUTURE
  // ===============
  function extractAllTokensFromAmmAndReserve() external onlyOwner {
    reserve.transferStableTokenToAMM(stableToken.balanceOf(address(reserve)));
    stableToken.transfer(msg.sender, stableToken.balanceOf(address(this)));
    payable(msg.sender).transfer(address(this).balance);
  }
}
