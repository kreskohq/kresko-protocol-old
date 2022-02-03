// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @notice A test ERC20
 */
contract ERC20Harness is ERC20, Ownable {
  constructor(
    string memory name_,
    string memory symbol_ // solhint-disable-next-line
  ) ERC20(name_, symbol_) {}

  function setBalance(address account, uint256 newBalance) external {
    uint256 existingBalance = balanceOf(account);
    if (existingBalance > newBalance) {
      _burn(account, existingBalance - newBalance);
    } else {
      _mint(account, newBalance - existingBalance);
    }
  }

  function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
  }
}
