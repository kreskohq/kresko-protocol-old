//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../interfaces/ICeloRegistry.sol";

// Not being used right now -- consider this in the future once
// dev tooling to use the registry is easiers
library CeloRegistry {
  address private constant REGISTRY =
    0x000000000000000000000000000000000000ce10;
  bytes32 private constant STABLE_TOKEN_REGISTRY_ID =
    keccak256(abi.encodePacked("StableToken"));

  function getStableToken() internal view returns (IERC20) {
    return
      IERC20(
        ICeloRegistry(REGISTRY).getAddressForOrDie(STABLE_TOKEN_REGISTRY_ID)
      );
  }
}
