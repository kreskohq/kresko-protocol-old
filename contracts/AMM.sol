//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

import "./interfaces/IOracle.sol";

contract AMM is Ownable, ERC20 {
  using SafeMath for uint256;

  IOracle public oracle;
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

  function swap(uint256 amount0Out, uint256 amount1Out) public {
    require(!(amount0Out > 0 && amount1Out > 0), "Error");

    updateBucketsIfNecessary();

    console.log(
      "Start swap",
      IERC20(token0).balanceOf(address(this)),
      IERC20(token1).balanceOf(address(this))
    );

    if (amount0Out > 0) IERC20(token0).transfer(msg.sender, amount0Out);
    if (amount1Out > 0) IERC20(token1).transfer(msg.sender, amount1Out);
    uint256 balance0 = IERC20(token0).balanceOf(address(this));
    uint256 balance1 = IERC20(token1).balanceOf(address(this));
    uint256 amount0In =
      balance0 > reserve0 - amount0Out ? balance0 - (reserve0 - amount0Out) : 0;
    uint256 amount1In =
      balance1 > reserve1 - amount1Out ? balance1 - (reserve1 - amount1Out) : 0;

    console.log("Swap", amount0Out, amount1Out);
    console.log("Current balances", balance0, balance1);
    console.log(amount0In, amount1In);

    require(
      amount0In > 0 || amount1In > 0,
      "UniswapV2: INSUFFICIENT_INPUT_AMOUNT"
    );

    console.log(balance0, balance1, balance0.mul(balance1));
    console.log(reserve0, reserve1, (reserve0).mul(reserve1));

    reserve0 = balance0;
    reserve1 = balance1;

    require(balance0.mul(balance1) >= reserve0.mul(reserve1), "UniswapV2: K");
  }
}
