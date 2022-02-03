//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

interface IOracle {
  function value() external view returns (uint256);
}
