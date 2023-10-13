// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import "forge-std/Test.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../src/mock/MockERC20.sol";
import "../src/LapuVault.sol";

contract LapuVaultTest is Test {
  MockERC20 mockERC20;
  LapuVault lapuVault;

  function setUp() public {
    mockERC20 = new MockERC20();
    mockERC20.faucet(address(this), 1000);
    lapuVault = new LapuVault(IERC20(address(mockERC20)), "LapuVault", "LAPU");
  }

  function testLapuVaultCanDepositAndWithdraw() public {
    assertEq(mockERC20.balanceOf(address(this)), 1000);
    assertEq(lapuVault.balanceOf(address(this)), 0);
    mockERC20.approve(address(lapuVault), 100);
    lapuVault.deposit(100, address(this));
    assertEq(mockERC20.balanceOf(address(this)), 900);
    assertEq(lapuVault.balanceOf(address(this)), 100);

    lapuVault.withdraw(100, address(this), address(this));
    assertEq(mockERC20.balanceOf(address(this)), 1000);
    assertEq(lapuVault.balanceOf(address(this)), 0);
  }
}
