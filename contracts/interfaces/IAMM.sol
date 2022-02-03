//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./IOracle.sol";
import "./IReserve.sol";

interface IAMM {
  function oracle() external view returns (IOracle);

  function reserve() external view returns (IReserve);

  function kAssetBucket() external view returns (uint256);

  function addLiquidity() external;
}
