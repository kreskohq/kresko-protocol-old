//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IOracle.sol";
import "./interfaces/IReserve.sol";

contract AMM is Ownable {
  IOracle public oracle;
  IReserve public reserve;

  event SetOracle(address oracle);

  constructor(address oracle_) {
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
}
