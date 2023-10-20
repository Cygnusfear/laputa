// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import "forge-std/Test.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../src/interfaces/IMockERC20.sol";
import "../src/mock/MockPool.sol";
import "../src/interfaces/IPoolAddressesProvider.sol";
import "../src/mock/MockPoolAddressesProvider.sol";
import "../src/mock/MockERC20.sol";
import "../src/LapuVault.sol";

contract LapuVaultTest is Test {
  MockERC20 mockAToken;
  MockPool mockPool;
  MockPoolAddressesProvider mockPoolAddressesProvider;
  MockERC20 mockERC20;
  LapuVault lapuVault;

  function setUp() public {
    mockAToken = new MockERC20("MockAToken", "maToken");
    mockPool = new MockPool(IMockERC20(mockAToken));
    mockPoolAddressesProvider = new MockPoolAddressesProvider(address(mockPool));
    mockERC20 = new MockERC20("MockDAI", "mDAI");
    mockERC20.faucet(address(this), 1000);
    lapuVault = new LapuVault(
      address(this),
      IERC20(address(mockERC20)),
      "LapuVault",
      "LAPU",
      IPoolAddressesProvider(mockPoolAddressesProvider),
      IERC20(address(mockAToken))
    );
  }

  function testLapuVaultCanDepositAndWithdraw() public {
    assertEq(mockERC20.balanceOf(address(this)), 1000);
    assertEq(lapuVault.balanceOf(address(this)), 0);
    mockERC20.approve(address(lapuVault), 100);
    lapuVault.deposit(100, address(this));
    assertEq(mockERC20.balanceOf(address(this)), 900);
    assertEq(lapuVault.balanceOf(address(this)), 100);
    assertEq(lapuVault.totalSupply(), 100);
    assertEq(mockERC20.balanceOf(address(mockPool)), 100);
    assertEq(mockAToken.balanceOf(address(lapuVault)), 100);

    lapuVault.withdraw(100, address(this), address(this));
    assertEq(mockERC20.balanceOf(address(this)), 1000);
    assertEq(lapuVault.balanceOf(address(this)), 0);
    assertEq(lapuVault.totalSupply(), 0);
    assertEq(mockERC20.balanceOf(address(mockPool)), 0);
    assertEq(mockAToken.balanceOf(address(lapuVault)), 0);
  }

  function testLapuVaultTokenEconomic() public {
    uint256 initERC20Balance = 1000;
    uint256 depositAmount01 = 100;
    uint256 yieldAmount01 = 10;

    //deposit 100 into vault
    assertEq(mockERC20.balanceOf(address(this)), initERC20Balance);
    assertEq(lapuVault.balanceOf(address(this)), 0);
    mockERC20.approve(address(lapuVault), depositAmount01);
    lapuVault.deposit(100, address(this));
    assertEq(mockERC20.balanceOf(address(this)), initERC20Balance - depositAmount01);
    assertEq(lapuVault.balanceOf(address(this)), depositAmount01);
    assertEq(lapuVault.totalSupply(), depositAmount01);
    assertEq(mockERC20.balanceOf(address(mockPool)), depositAmount01);
    assertEq(mockAToken.balanceOf(address(lapuVault)), depositAmount01);

    //simulate DeFi giving out yield amount of 10 in aToken to vault
    mockERC20.mint(address(mockPool), yieldAmount01);
    mockAToken.mint(address(lapuVault), yieldAmount01);
    assertEq(mockAToken.balanceOf(address(lapuVault)), depositAmount01 + yieldAmount01);

    //call mintLAPUAccordingToDeFiYield to process the yield
    assertEq(lapuVault.balanceOf(address(lapuVault)), 0);
    lapuVault.mintLAPUAccordingToDeFiYield();
    assertEq(lapuVault.totalSupply(), depositAmount01 + yieldAmount01);
    //in mintLAPUAccordingToDeFiYield, yieldAmount01 is expected to be transferred to the contract owner (this test contract)
    assertEq(lapuVault.balanceOf(address(this)), depositAmount01 + yieldAmount01);

    //player withdraws deposit and yield
    lapuVault.withdraw(depositAmount01 + yieldAmount01, address(this), address(this));
    assertEq(mockERC20.balanceOf(address(this)), initERC20Balance + yieldAmount01);
    assertEq(lapuVault.balanceOf(address(this)), 0);
    assertEq(lapuVault.totalSupply(), 0);
    assertEq(mockERC20.balanceOf(address(mockPool)), 0);
    assertEq(mockAToken.balanceOf(address(lapuVault)), 0);
  }
}
