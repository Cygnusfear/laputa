// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { GameSetting } from "../src/codegen/index.sol";

contract DefiSystemTest is MudTest {
  IWorld public world;

  function setUp() public override {
    super.setUp();
    world = IWorld(worldAddress);
  }

  function testWorldExists() public {
    uint256 codeSize;
    address addr = worldAddress;
    assembly {
      codeSize := extcodesize(addr)
    }
    assertTrue(codeSize > 0);
  }

  function testDefiSystemCycle() public {
    address player01 = address(0x5E11E1); // random address
    uint256 amount01 = 1000;
    uint256 amount02 = 100;
    uint256 amount03 = 30;

    IERC20 dai = IERC20(GameSetting.getDaiAddress());
    IERC20 lapu = IERC20(GameSetting.getLapuVaultAddress());

    //1. player get DAI from faucet
    world.mockDaiFaucet(player01, amount01);
    assertEq(world.defiDaiBalanceOf(player01), amount01);

    vm.startPrank(player01);
    //2. player swap DAI to LAPU
    dai.approve(address(world), amount01);
    world.defiSwapDaiToLapu(amount01, player01);
    assertEq(world.defiDaiBalanceOf(player01), 0);
    assertEq(world.defiLapuBalanceOf(player01), amount01);

    //3. player consume LAPU in game, i.e. for building facilities
    lapu.approve(address(world), amount02);
    world.defiConsumesLapuFromPlayer(amount02, player01);
    assertEq(world.defiLapuBalanceOf(player01), amount01 - amount02);
    //4. LAPU balance of this world contract = reward balance
    assertEq(world.defiGetTotalRewardBalance(), amount02);
    vm.stopPrank();

    //5. mock yield generation from DeFi pool (which we can call periodically from client)
    world.mockYieldGenerationFromDeFiPool(amount03);
    assertEq(world.defiGetTotalRewardBalance(), amount02 + amount03);

    //6. mock release reward to player
    world.mockReleaseRewardToPlayer(player01, amount03);
    assertEq(world.defiGetTotalRewardBalance(), amount02);
    assertEq(world.defiLapuBalanceOf(player01), amount01 - amount02 + amount03);

    vm.startPrank(player01);
    //7. player can cash out LAPU to DAI
    lapu.approve(address(world), amount03);
    world.defiSwapLapuToDai(amount03, player01);
    assertEq(world.defiLapuBalanceOf(player01), amount01 - amount02);
    assertEq(world.defiDaiBalanceOf(player01), amount03);
    vm.stopPrank();
  }
}
