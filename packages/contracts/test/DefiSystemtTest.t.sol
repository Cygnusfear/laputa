// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { GameSetting, PlayerDataDetail } from "../src/codegen/index.sol";

contract DefiSystemTest is MudTest {
  IWorld public world;
  uint32 public constant entityTypeIdGroundLevel = 1;
  uint32 public constant entityTypeIdResidence = 103;

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
    bytes32 player01Key = bytes32(bytes20(player01));
    uint256 amount01 = 1000;
    uint256 amount02 = 475;
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

    //3. player build facility and consume LAPU in game
    vm.startPrank(player01);
    lapu.approve(address(world), amount01);
    world.buildFacility(entityTypeIdGroundLevel, 1, 0, 1, 0, "#ffffff", 0);
    world.buildFacility(entityTypeIdResidence, 1, 1, 1, 0, "#ffffff", 0);
    vm.stopPrank();
    assertEq(world.defiLapuBalanceOf(player01), amount01 - amount02);
    assertEq(GameSetting.getTotalResidence(), 1);
    assertEq(PlayerDataDetail.getResidence(player01Key), 1);

    //4. LAPU balance of this world contract = reward balance
    assertEq(world.defiGetTotalRewardBalance(), amount02);

    //5. mock yield generation from DeFi pool (which we can call periodically call from client)
    world.mockYieldGenerationFromDeFiPool(amount03);
    assertEq(world.defiGetTotalRewardBalance(), amount02 + amount03);

    //6. release rewards to players
    world.defiDistributeRewardsToPlayers();
    assertEq(world.defiGetTotalRewardBalance(), 0);
    assertEq(world.defiLapuBalanceOf(player01), amount01 + amount03);

    vm.startPrank(player01);
    //7. player can cash out LAPU to DAI
    lapu.approve(address(world), amount03);
    world.defiSwapLapuToDai(amount03, player01);
    assertEq(world.defiLapuBalanceOf(player01), amount01);
    assertEq(world.defiDaiBalanceOf(player01), amount03);
    vm.stopPrank();
  }
}
