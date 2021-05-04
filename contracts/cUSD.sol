// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract cUSD is ERC20 {
  constructor() ERC20("Celo Dollars", "cUSD") {}

  function mint(address to, uint256 amount) external {
    _mint(to, amount);
  }
}
