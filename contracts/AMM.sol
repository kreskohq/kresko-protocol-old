//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IOracle.sol";

contract AMM is Ownable {
	IOracle public oracle;

	event SetOracle(address oracle);

  constructor(address oracle_) {
		_setOracle(oracle_);
  }

	function setOracle(address newOracle) external onlyOwner {
		_setOracle(newOracle);
	}

	function _setOracle(address newOracle) internal {
		oracle = IOracle(newOracle);
		emit SetOracle(newOracle);
	}
}
