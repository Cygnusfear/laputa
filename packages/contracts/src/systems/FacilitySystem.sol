// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { System } from "@latticexyz/world/src/System.sol";
import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import { PackedCounter } from "@latticexyz/store/src/PackedCounter.sol";

import { Counter, Position, PositionTableId, Orientation, EntityType, OwnedBy } from "../codegen/index.sol";

contract FacilitySystem is System {
  function buildFacility(uint32 entityTypeId, int32 x, int32 y, int32 z, int32 yaw) public returns (bytes32) {
    require(_msgSender() != address(0), "Invalid sender address");

    //TODO: require _msgSender() to have enough resources to build this facility

    //require the target position to be empty
    bytes memory _staticData;
    PackedCounter _encodedLengths;
    bytes memory _dynamicData;
    (_staticData, _encodedLengths, _dynamicData) = Position.encode(x, y, z);
    bytes32[] memory keysAtPosition = getKeysWithValue(PositionTableId, _staticData, _encodedLengths, _dynamicData);
    require(keysAtPosition.length == 0, "Position is occupied");

    //create entity and assign component values
    bytes32 entityId = getUniqueEntity();
    Position.set(entityId, x, y, z);
    Orientation.set(entityId, yaw);
    EntityType.set(entityId, entityTypeId);
    OwnedBy.set(entityId, _msgSender());

    return entityId;
  }
}
