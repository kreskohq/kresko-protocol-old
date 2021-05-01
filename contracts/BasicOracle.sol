//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

contract BasicOracle {
  address public reporter;
  uint256 public value;

  event SetReporter(address oracle);

  modifier onlyReporter() {
    require(msg.sender == reporter, "Sender not oracle");
    _;
  }

  constructor(address oracle_) {
    _setReporter(oracle_);
  }

  function setValue(uint256 newValue) external onlyReporter {
    value = newValue;
  }

  function setReporter(address newOracle) external onlyReporter {
    _setReporter(newOracle);
  }

  function _setReporter(address newReporter) internal {
    reporter = newReporter;
    emit SetReporter(newReporter);
  }
}
