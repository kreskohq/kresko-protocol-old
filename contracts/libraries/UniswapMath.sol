//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

library UniswapMath {
  function sqrt(uint256 x) external pure returns (uint256 y) {
    uint256 z = (x + 1) / 2;
    y = x;
    while (z < y) {
      y = z;
      z = (x / z + z) / 2;
    }
  }

  // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
  function getAmountOut(
    uint256 amountIn,
    uint256 reserveIn,
    uint256 reserveOut
  ) public pure returns (uint256 amountOut) {
    require(amountIn > 0, "INSUFFICIENT_INPUT_AMOUNT");
    require(reserveIn > 0 && reserveOut > 0, "INSUFFICIENT_LIQUIDITY");

    uint256 numerator = amountIn * reserveOut;
    uint256 denominator = reserveIn + amountIn;
    amountOut = numerator / denominator;

    require(reserveOut > amountOut, "INSUFFICIENT_LIQUIDITY");
  }
}
