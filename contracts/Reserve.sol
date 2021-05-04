//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./libraries/CeloRegistry.sol";

contract Reserve {
  address public kresko;
  address public amm;

  modifier onlyKreskoOrAMM() {
    require(
      msg.sender == kresko || msg.sender == amm,
      "Sender not Kresko or AMM"
    );
    _;
  }

  function transferStableTokenToAMM(uint256 amount) external onlyKreskoOrAMM {
    require(
      CeloRegistry.getStableToken().transfer(amm, amount),
      "Reserve: AMM transfer failed"
    );
  }
}
