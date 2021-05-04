//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

interface IReserve {
  function transferStableTokenToAMM(uint256 amount) external;
}
