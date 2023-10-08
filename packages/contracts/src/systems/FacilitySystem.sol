// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { System } from "@latticexyz/world/src/System.sol";
//import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import { PackedCounter } from "@latticexyz/store/src/PackedCounter.sol";

import { Counter, Position, PositionTableId, Orientation, EntityType, OwnedBy } from "../codegen/index.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";

contract FacilitySystem is System {
  /**
   * @dev Build a facility of entityTypeId at the given position with the given yaw.
   * @param entityTypeId The entityTypeId of the facility to build.
   * @param x The x coordinate of the position to build the facility at.
   * @param y The y coordinate of the position to build the facility at.
   * @param z The z coordinate of the position to build the facility at.
   * @param yaw The yaw of the facility to build.
   * @return The key of the entity that was created.
   */
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
    bytes32 entityKey = positionToEntityKey(x, y, z);
    Position.set(entityKey, x, y, z);
    Orientation.set(entityKey, yaw);
    EntityType.set(entityKey, entityTypeId);
    OwnedBy.set(entityKey, _msgSender());

    return entityKey;
  }
}
