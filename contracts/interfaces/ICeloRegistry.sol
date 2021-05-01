//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

interface ICeloRegistry {
  function setAddressFor(string calldata, address) external;

  function getAddressForOrDie(bytes32) external view returns (address);

  function getAddressFor(bytes32) external view returns (address);

  function isOneOf(bytes32[] calldata, address) external view returns (bool);
}
