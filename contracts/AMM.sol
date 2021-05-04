//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

import "./interfaces/IOracle.sol";
import "./interfaces/IReserve.sol";

contract AMM is Ownable, ERC20 {
  using SafeMath for uint256;

  IOracle public oracle;
  IReserve public reserve;

  address public token0;
  address public token1;

  uint256 reserve0;
  uint256 reserve1;

  event SetOracle(address oracle);

  constructor(
    address oracle_,
    address token0_,
    address token1_
  ) ERC20("Kresko AMM LP", "KLP") {
    token0 = token0_;
    token1 = token1_;

    _setOracle(oracle_);
  }

  function setReserve(address reserve_) external onlyOwner {
    require(address(reserve) == address(0), "AMM: Reserve already set");
    reserve = IReserve(reserve_);
  }

  function setOracle(address newOracle) external onlyOwner {
    _setOracle(newOracle);
  }

  function _setOracle(address newOracle) internal {
    oracle = IOracle(newOracle);
    emit SetOracle(newOracle);
  }

  function sqrt(uint256 x) private pure returns (uint256 y) {
    uint256 z = (x + 1) / 2;
    y = x;
    while (z < y) {
      y = z;
      z = (x / z + z) / 2;
    }
  }

  function mint() public {
    uint256 balance0 = IERC20(token0).balanceOf(address(this));
    uint256 balance1 = IERC20(token1).balanceOf(address(this));
    uint256 amount0 = balance0.sub(reserve0);
    uint256 amount1 = balance1.sub(reserve1);

    uint256 totalSupply = totalSupply();
    if (totalSupply == 0) {
      uint256 liquidity = sqrt(amount0.mul(amount1));
      _mint(msg.sender, liquidity);
    } else {
      uint256 liquidity =
        Math.min(
          amount0.mul(totalSupply) / reserve0,
          amount1.mul(totalSupply) / reserve1
        );
      require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");
      _mint(msg.sender, liquidity);
    }

    reserve0 = balance0;
    reserve1 = balance1;
  }

  function removeLiquidity() public {}

  function updateBucketsIfNecessary() public {}

  // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
  function getAmountOut(
    uint256 amountIn,
    uint256 reserveIn,
    uint256 reserveOut
  ) internal pure returns (uint256 amountOut) {
    require(amountIn > 0, "UniswapV2Library: INSUFFICIENT_INPUT_AMOUNT");
    require(
      reserveIn > 0 && reserveOut > 0,
      "UniswapV2Library: INSUFFICIENT_LIQUIDITY"
    );

    uint256 numerator = amountIn.mul(reserveOut);
    uint256 denominator = reserveIn.add(amountIn);
    amountOut = numerator / denominator;

    require(reserveOut > amountOut, "INSUFFICIENT_LIQUIDITY");
  }

  function swapExact(uint256 amountIn, address fromToken) external {
    uint256 amountOut =
      fromToken == token0
        ? getAmountOut(
          amountIn,
          IERC20(token0).balanceOf(address(this)),
          IERC20(token1).balanceOf(address(this))
        )
        : getAmountOut(
          amountIn,
          IERC20(token1).balanceOf(address(this)),
          IERC20(token0).balanceOf(address(this))
        );

    console.log("swapExact", amountIn, amountOut);
    IERC20(fromToken).transferFrom(msg.sender, address(this), amountIn);
    fromToken == token0 ? swap(0, amountOut) : swap(amountOut, 0);
  }

  function swap(uint256 amount0Out, uint256 amount1Out) public {
    require(!(amount0Out > 0 && amount1Out > 0), "Error");

    updateBucketsIfNecessary();

    if (amount0Out > 0) IERC20(token0).transfer(msg.sender, amount0Out);
    if (amount1Out > 0) IERC20(token1).transfer(msg.sender, amount1Out);
    uint256 balance0 = IERC20(token0).balanceOf(address(this));
    uint256 balance1 = IERC20(token1).balanceOf(address(this));
    uint256 amount0In =
      balance0 > reserve0 - amount0Out ? balance0 - (reserve0 - amount0Out) : 0;
    uint256 amount1In =
      balance1 > reserve1 - amount1Out ? balance1 - (reserve1 - amount1Out) : 0;

    require(
      amount0In > 0 || amount1In > 0,
      "UniswapV2: INSUFFICIENT_INPUT_AMOUNT"
    );

    require(balance0.mul(balance1) >= reserve0.mul(reserve1), "UniswapV2: K");

    reserve0 = balance0;
    reserve1 = balance1;
  }
}
