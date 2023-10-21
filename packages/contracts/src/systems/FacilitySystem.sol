// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { System } from "@latticexyz/world/src/System.sol";
//import { getUniqueEntity } from "@latticexyz/world-modules/src/modules/uniqueentity/getUniqueEntity.sol";
import { getKeysWithValue } from "@latticexyz/world-modules/src/modules/keyswithvalue/getKeysWithValue.sol";
import { getKeysInTable } from "@latticexyz/world-modules/src/modules/keysintable/getKeysInTable.sol";
import { PackedCounter } from "@latticexyz/store/src/PackedCounter.sol";

import { Counter, Position, PositionTableId, Orientation, EntityType, OwnedBy, EntityCustomization, GameSetting, EntityTypeDetail, PlayerDataDetail } from "../codegen/index.sol";
import { positionToEntityKey } from "../positionToEntityKey.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FacilitySystem is System {
  /**
   * @dev Check if an entityTypeId is a ground level facility.
   * @param entityTypeId The entityTypeId of the facility to check.
   * @return True if the facility is a ground level facility, false otherwise.
   */
  function isEntityTypeIdGroundLevelFacility(uint32 entityTypeId) public pure returns (bool) {
    return entityTypeId <= 100;
  }

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

  function facilitySystemSetupEntityTypeDetails() public {
    EntityTypeDetail.set(1, 400, 0);
    EntityTypeDetail.set(102, 300, 0);
    EntityTypeDetail.set(103, 75, 1);
    EntityTypeDetail.set(104, 50, 0);
  }

  /**
   * @dev Check if a player can build a facility of entityTypeId.
   * @param player The address of the player to check.
   * @param entityTypeId The entityTypeId of the facility to check.
   * @return True if the player can build a facility of entityTypeId, false otherwise.
   */
  function canPlayerBuildFacilityType(address player, uint32 entityTypeId) public view returns (bool) {
    uint256 buildingCostLapu = EntityTypeDetail.getBuildingCostLapu(entityTypeId);
    IERC20 lapu = IERC20(GameSetting.getLapuVaultAddress());
    return lapu.balanceOf(player) >= buildingCostLapu;
  }

  function lapuCostToBuildFacilityType(uint32 entityTypeId) public view returns (uint256) {
    uint256 buildingCostLapu = EntityTypeDetail.getBuildingCostLapu(entityTypeId);
    if (buildingCostLapu > 0) return buildingCostLapu;
    else return 100;
  }

  function consumeResourcesToBuildFacilityType(address consumer, uint32 entityTypeId) public {
    //transfer buildingCostLapu LAPU from consumer to this world contract
    uint256 buildingCostLapu = lapuCostToBuildFacilityType(entityTypeId);
    IERC20 lapu = IERC20(GameSetting.getLapuVaultAddress());
    SafeERC20.safeTransferFrom(lapu, consumer, address(this), buildingCostLapu);
  }

  function updatePlayerDataDetailForBuildingFacilityType(address player, uint32 entityTypeId) public {
    uint256 residence = EntityTypeDetail.getResidence(entityTypeId);
    if (residence > 0) {
      GameSetting.setTotalResidence(GameSetting.getTotalResidence() + residence);
      PlayerDataDetail.setResidence(player, PlayerDataDetail.getResidence(player) + residence);
    }
  }

  function updatePlayerDataDetailForDestroyFacilityType(address player, uint32 entityTypeId) public {
    uint256 residence = EntityTypeDetail.getResidence(entityTypeId);
    if (residence > 0) {
      GameSetting.setTotalResidence(GameSetting.getTotalResidence() - residence);
      PlayerDataDetail.setResidence(player, PlayerDataDetail.getResidence(player) - residence);
    }
  }

  /**
   * @dev Check if a position is next to an existing entity.
   * @param x The x coordinate of the position to check.
   * @param y The y coordinate of the position to check.
   * @param z The z coordinate of the position to check.
   * @return True if the position is next to an existing entity, false otherwise.
   */
  function isPositionNextToAnExistingEntity(int32 x, int32 y, int32 z) public view returns (bool) {
    if (!isPositionEmpty(x, y - 1, z)) return true;
    if (!isPositionEmpty(x, y + 1, z)) return true;
    if (!isPositionEmpty(x - 1, y, z)) return true;
    if (!isPositionEmpty(x + 1, y, z)) return true;
    if (!isPositionEmpty(x, y, z - 1)) return true;
    if (!isPositionEmpty(x, y, z + 1)) return true;
    return false;
  }

  /**
   * @dev Check if a facility of entityTypeId can be built at the given position.
   * @param entityTypeId The entityTypeId of the facility to check.
   * @param x The x coordinate of the position to check.
   * @param y The y coordinate of the position to check.
   * @param z The z coordinate of the position to check.
   * @return True if a facility of entityTypeId can be built at the given position, false otherwise.
   */
  function canBuildFacilityTypeAtPosition(uint32 entityTypeId, int32 x, int32 y, int32 z) public view returns (bool) {
    if (y < 0) return false;
    if (!isPositionEmpty(x, y, z)) return false;
    if (y == 0) return isEntityTypeIdGroundLevelFacility(entityTypeId);
    return isPositionNextToAnExistingEntity(x, y, z);
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
  function buildFacility(
    uint32 entityTypeId,
    int32 x,
    int32 y,
    int32 z,
    int32 yaw,
    string calldata color,
    uint32 variant
  ) public returns (bytes32) {
    require(_msgSender() != address(0), "Invalid sender address");
    require(canPlayerBuildFacilityType(_msgSender(), entityTypeId), "Cannot build this facility type");
    require(canBuildFacilityTypeAtPosition(entityTypeId, x, y, z), "This facility cannot be built at this position");

    consumeResourcesToBuildFacilityType(_msgSender(), entityTypeId);

    //create entity and assign component values
    bytes32 entityKey = positionToEntityKey(x, y, z);
    Position.set(entityKey, x, y, z);
    Orientation.set(entityKey, yaw);
    EntityType.set(entityKey, entityTypeId);
    EntityCustomization.set(entityKey, variant, color);
    OwnedBy.set(entityKey, _msgSender());

    updatePlayerDataDetailForBuildingFacilityType(_msgSender(), entityTypeId);

    return entityKey;
  }

  /**
   * @dev Destroy the facility at the given position.
   * @param entityKey The key of the facility to destroy.
   */
  function destroyFacility(bytes32 entityKey) public {
    require(_msgSender() != address(0), "Invalid sender address");
    require(OwnedBy.get(entityKey) == _msgSender(), "Sender does not own this entity");

    updatePlayerDataDetailForDestroyFacilityType(_msgSender(), EntityType.get(entityKey));

    OwnedBy.deleteRecord(entityKey);
    EntityType.deleteRecord(entityKey);
    Orientation.deleteRecord(entityKey);
    Position.deleteRecord(entityKey);
    EntityCustomization.deleteRecord(entityKey);
  }

  function getAllFacilityEntityKeys() public view returns (bytes32[][] memory) {
    return getKeysInTable(PositionTableId);
  }
}
