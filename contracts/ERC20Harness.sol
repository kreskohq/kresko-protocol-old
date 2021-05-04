// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice A test ERC20
 */
contract ERC20Harness is ERC20 {
	
  constructor(
    string memory name_,
    string memory symbol_ // solhint-disable-next-line
  ) ERC20(name_, symbol_) {}

	// TODO add harness functions
}
