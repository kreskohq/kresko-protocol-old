//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./libraries/CeloRegistry.sol";

contract Reserve {
  IERC20 public stableToken;
  address public kresko;
  address public amm;

  constructor(
    address stableToken_,
    address kresko_,
    address amm_
  ) {
    stableToken = IERC20(stableToken_);
    kresko = kresko_;
    amm = amm_;
  }

  modifier onlyKreskoOrAMM() {
    require(
      msg.sender == kresko || msg.sender == amm,
      "Reserve: Sender not Kresko/AMM"
    );
    _;
  }

  function transferStableTokenToAMM(uint256 amount) external onlyKreskoOrAMM {
    require(stableToken.transfer(amm, amount), "Reserve: AMM transfer failed");
  }
}
