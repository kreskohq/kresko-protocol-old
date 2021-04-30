// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KAsset is ERC20 {
	address public kresko;

	modifier onlyKresko() {
		require(msg.sender == kresko, "Sender not kresko");
		_;
	}

	constructor(
		address kresko_,
		string memory name_,
		string memory symbol_
	) ERC20(name_, symbol_) {
		kresko = kresko_;
	}

	function mint(address to, uint amount) external onlyKresko {
		_mint(to, amount);
	}
}