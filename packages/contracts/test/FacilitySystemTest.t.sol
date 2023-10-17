// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import "forge-std/Test.sol";
import { MudTest } from "@latticexyz/world/test/MudTest.t.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";

import { IWorld } from "../src/codegen/world/IWorld.sol";
import { Counter, CounterTableId, Position, PositionData } from "../src/codegen/index.sol";
import { positionToEntityKey } from "../src/positionToEntityKey.sol";

contract FacilitySystemTest is MudTest {
  IWorld public world;
  uint32 public constant entityTypeIdGroundLevel = 10;
  uint32 public constant entityTypeIdNonGroundLevel = 999;

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

  function testCanBuildFacilityTypeAtPosition() public {
    //cannot build at y < 0
    vm.expectRevert(abi.encodePacked("This facility cannot be built at this position"));
    world.buildFacility(entityTypeIdGroundLevel, 1, -1, 1, 0, "#ffffff", 0);

    //cannot build non ground level facility at y = 0
    vm.expectRevert(abi.encodePacked("This facility cannot be built at this position"));
    world.buildFacility(entityTypeIdNonGroundLevel, 1, 0, 1, 0, "#ffffff", 0);

    //build a ground level facility at position (1,0,1) with yaw 0
    bytes32 entityKey01 = world.buildFacility(entityTypeIdGroundLevel, 1, 0, 1, 0, "#ffffff", 0);
    PositionData memory posData01 = Position.get(entityKey01);
    assertEq(posData01.x, 1);

    //cannot build on occupied position
    vm.expectRevert(abi.encodePacked("This facility cannot be built at this position"));
    world.buildFacility(entityTypeIdGroundLevel, 1, 0, 1, 0, "#ffffff", 0);

    //cannot build entityTypeIdNonGroundLevel on position with nothing next to it
    vm.expectRevert(abi.encodePacked("This facility cannot be built at this position"));
    world.buildFacility(entityTypeIdNonGroundLevel, 3, 0, 1, 0, "#ffffff", 0);

    //can build entityTypeIdNonGroundLevel on position with something next to it
    bytes32 entityKey02 = world.buildFacility(entityTypeIdNonGroundLevel, 1, 1, 1, 0, "#ffffff", 0);
    PositionData memory posData02 = Position.get(entityKey02);
    assertEq(posData02.y, 1);
  }

  function testBuildFacility() public {
    //build an entityTypeIdGroundLevel facility at position (1,1,1) with yaw 0
    bytes32 entityKey01 = world.buildFacility(entityTypeIdGroundLevel, 1, 0, 1, 0, "#ffffff", 0);
    PositionData memory posData01 = Position.get(entityKey01);
    assertEq(posData01.x, 1);

    //cannot build on occupied position
    vm.expectRevert(abi.encodePacked("This facility cannot be built at this position"));
    world.buildFacility(entityTypeIdGroundLevel, 1, 0, 1, 0, "#ffffff", 0);

    //should be able to build on an unoccupied position
    bytes32 entityKey03 = world.buildFacility(entityTypeIdGroundLevel, 2, 0, 1, 0, "#ffffff", 0);
    PositionData memory posData03 = Position.get(entityKey03);
    assertEq(posData03.x, 2);

    //should return all entityKeys
    bytes32[][] memory allEntityKeys = world.getAllFacilityEntityKeys();
    assertEq(allEntityKeys.length, 2);
  }

  function testDestroyFacility() public {
    vm.expectRevert(abi.encodePacked("Sender does not own this entity"));
    world.destroyFacility(0);

    //build an entityTypeIdGroundLevel facility at position (1,1,1) with yaw 0
    bytes32 entityKey01 = world.buildFacility(entityTypeIdGroundLevel, 1, 0, 1, 0, "#ffffff", 0);
    PositionData memory posData01 = Position.get(entityKey01);
    assertEq(posData01.x, 1);

    //destroyFacility should work as expected
    world.destroyFacility(entityKey01);
    PositionData memory posData01b = Position.get(entityKey01);
    assertNotEq(posData01b.x, 1);

    //should now be able to build on the same position after the original one was destroyed
    bytes32 entityKey02 = world.buildFacility(11, 1, 0, 1, 0, "#ffffff", 0);
    PositionData memory posData02 = Position.get(entityKey02);
    assertEq(posData02.x, 1);
  }
}
