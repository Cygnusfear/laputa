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
   * @dev Check if a facility can be built at the given position.
   * @param x The x coordinate of the position to check.
   * @param y The y coordinate of the position to check.
   * @param z The z coordinate of the position to check.
   * @return True if a facility can be built at the given position, false otherwise.
   */
  function isPositionEmpty(int32 x, int32 y, int32 z) public view returns (bool) {
    bytes memory _staticData;
    PackedCounter _encodedLengths;
    bytes memory _dynamicData;
    (_staticData, _encodedLengths, _dynamicData) = Position.encode(x, y, z);
    bytes32[] memory keysAtPosition = getKeysWithValue(PositionTableId, _staticData, _encodedLengths, _dynamicData);
    return keysAtPosition.length == 0;
  }

  /**
   * @dev Check if a player can build a facility of entityTypeId.
   * @param player The address of the player to check.
   * @param entityTypeId The entityTypeId of the facility to check.
   * @return True if the player can build a facility of entityTypeId, false otherwise.
   */
  function canPlayerBuildFacilityType(address player, uint32 entityTypeId) public view returns (bool) {
    //TODO: require player to have enough resources to build this facility
    return true;
  }

  /**
   * @dev Check if a player owns a facility.
   * @param player The address of the player to check.
   * @param entityKey The key of the facility to check.
   * @return True if the player owns the facility, false otherwise.
   */
  function isPlayerOwnerOfFacility(address player, bytes32 entityKey) public view returns (bool) {
    return OwnedBy.get(entityKey) == player;
  }

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
    require(canPlayerBuildFacilityType(_msgSender(), entityTypeId), "Cannot build this facility type");
    require(isPositionEmpty(x, y, z), "Position is occupied");

    //TODO: consume resources from sender to build facility

    //create entity and assign component values
    bytes32 entityKey = positionToEntityKey(x, y, z);
    Position.set(entityKey, x, y, z);
    Orientation.set(entityKey, yaw);
    EntityType.set(entityKey, entityTypeId);
    OwnedBy.set(entityKey, _msgSender());

    return entityKey;
  }

  /**
   * @dev Destory the facility at the given position.
   * @param entityKey The key of the facility to destory.
   */
  function destoryFacility(bytes32 entityKey) public {
    require(_msgSender() != address(0), "Invalid sender address");
    require(isPlayerOwnerOfFacility(_msgSender(), entityKey), "Sender does not own this entity");

    OwnedBy.deleteRecord(entityKey);
    EntityType.deleteRecord(entityKey);
    Orientation.deleteRecord(entityKey);
    Position.deleteRecord(entityKey);
  }
}
