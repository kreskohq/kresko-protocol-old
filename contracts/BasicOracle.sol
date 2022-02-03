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

  constructor(address reporter_) {
    _setReporter(reporter_);
  }

  function setValue(uint256 newValue) external onlyReporter {
    value = newValue;
  }

  function setReporter(address newReporter) external onlyReporter {
    _setReporter(newReporter);
  }

  function _setReporter(address newReporter) internal {
    reporter = newReporter;
    emit SetReporter(newReporter);
  }
}
