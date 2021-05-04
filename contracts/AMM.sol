//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

import "./libraries/UniswapMath.sol";
import "./interfaces/IOracle.sol";
import "./interfaces/IReserve.sol";

contract AMM is Ownable, ERC20 {
  using SafeMath for uint256;

  IOracle public oracle;
  IReserve public reserve;

  address public token0;
  address public token1;

  uint256 public bucket0;
  uint256 public bucket1;

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

  // low level function that must be called from another SC
  function mint() public {
    uint256 balance0 = IERC20(token0).balanceOf(address(this));
    uint256 balance1 = IERC20(token1).balanceOf(address(this));
    uint256 amount0 = balance0.sub(bucket0);
    uint256 amount1 = balance1.sub(bucket1);

    uint256 totalSupply = totalSupply();
    if (totalSupply == 0) {
      uint256 liquidity = UniswapMath.sqrt(amount0.mul(amount1));
      _mint(msg.sender, liquidity);
    } else {
      uint256 liquidity =
        Math.min(
          amount0.mul(totalSupply) / bucket0,
          amount1.mul(totalSupply) / bucket1
        );
      require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");
      _mint(msg.sender, liquidity);
    }

    bucket0 = balance0;
    bucket1 = balance1;
  }

  // given an input amount of an asset and pair reserves, returns the maximum output amount of the other asset
  function getAmountOut(
    uint256 amountIn,
    uint256 reserveIn,
    uint256 reserveOut
  ) internal pure returns (uint256 amountOut) {
    require(amountIn > 0, "INSUFFICIENT_INPUT_AMOUNT");
    require(reserveIn > 0 && reserveOut > 0, "INSUFFICIENT_LIQUIDITY");

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

    if (amount0Out > 0) IERC20(token0).transfer(msg.sender, amount0Out);
    if (amount1Out > 0) IERC20(token1).transfer(msg.sender, amount1Out);
    uint256 balance0 = IERC20(token0).balanceOf(address(this));
    uint256 balance1 = IERC20(token1).balanceOf(address(this));
    uint256 amount0In =
      balance0 > bucket0 - amount0Out ? balance0 - (bucket0 - amount0Out) : 0;
    uint256 amount1In =
      balance1 > bucket1 - amount1Out ? balance1 - (bucket1 - amount1Out) : 0;

    require(amount0In > 0 || amount1In > 0, "INSUFFICIENT_INPUT_AMOUNT");

    // TODO: Figure out how uniswap is not vulnerable to reentrancy
    // solhint-disable-next-line
    bucket0 = balance0;
    // solhint-disable-next-line
    bucket1 = balance1;

    require(balance0.mul(balance1) >= bucket0.mul(bucket1), "UniswapV2: K");
  }
}
