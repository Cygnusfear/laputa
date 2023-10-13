// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IMockERC20 {
  function faucet(address to, uint256 amount) external;

  function mint(address to, uint256 amount) external;

  function burn(address from, uint256 amount) external;
}
