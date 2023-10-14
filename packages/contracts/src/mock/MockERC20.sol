// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../interfaces/IMockERC20.sol";

contract MockERC20 is ERC20, IMockERC20 {
  constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {}

  function faucet(address to, uint256 amount) external {
    _mint(to, amount);
  }

  function decimals() public view virtual override returns (uint8) {
    return 18;
  }

  function mint(address to, uint256 amount) external {
    _mint(to, amount);
  }

  function burn(address from, uint256 amount) external {
    _burn(from, amount);
  }
}
