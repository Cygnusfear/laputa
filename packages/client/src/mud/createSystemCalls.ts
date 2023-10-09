/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import { getComponentValue } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { Vector3 } from "three";
import { ethers } from "ethers";

import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   * - Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/react/packages/client/src/mud/setupNetwork.ts#L31).
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/react/packages/client/src/mud/setupNetwork.ts#L39).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs (https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/react/packages/client/src/mud/setupNetwork.ts#L39).
   */
  { worldContract, waitForTransaction }: SetupNetworkResult,
  { Counter, Position, Orientation, EntityType, OwnedBy }: ClientComponents
) {
  const defaultVector3 = new Vector3(1, 0, 1);

  const increment = async () => {
    /*
     * Because IncrementSystem
     * (https://mud.dev/tutorials/walkthrough/minimal-onchain#incrementsystemsol)
     * is in the root namespace, `.increment` can be called directly
     * on the World contract.
     */
    const tx = await worldContract.write.increment();
    await waitForTransaction(tx);
    return getComponentValue(Counter, singletonEntity);
  };

  const mudGetEntityType = async (entityKey) => {
    return getComponentValue(EntityType, entityKey);
  };

  const mudGetOwnedBy = async (entityKey) => {
    return getComponentValue(OwnedBy, entityKey);
  };

  const mudGetOrientation = async (entityKey) => {
    return getComponentValue(Orientation, entityKey);
  };

  const mudGetPosition = async (entityKey) => {
    return getComponentValue(Position, entityKey);
  };

  const mudPositionToEntityKey = (pos: Vector3) => {
    return ethers.utils.solidityKeccak256(
      ["uint256", "uint256", "uint256"],
      [pos.x, pos.y, pos.z]
    );
  };

  const mudIsPositionEmpty = async (pos: Vector3 = defaultVector3) => {
    const res = await worldContract.read.isPositionEmpty([pos.x, pos.y, pos.z]);
    return res;
  };

  const mudBuildFacility = async (
    entityTypeId: number = 10,
    x: number = defaultVector3.x,
    y: number = defaultVector3.y,
    z: number = defaultVector3.z,
    yaw: number = 0
  ) => {
    const tx = await worldContract.write.buildFacility([
      entityTypeId,
      x,
      y,
      z,
      yaw,
    ]);
    await waitForTransaction(tx);
    return tx;
  };

  const mudGetEntityMetadataAtPosition = async (
    pos: Vector3 = defaultVector3
  ) => {
    const isPosEmpty = await mudIsPositionEmpty(pos);
    if (isPosEmpty) {
      return null;
    }

    const entityKey = mudPositionToEntityKey(pos);
    const entityTypeId = await mudGetEntityType(entityKey);
    const orientation = await mudGetOrientation(entityKey);
    const ownedBy = await mudGetOwnedBy(entityKey);

    return {
      entityKey,
      position: pos,
      entityTypeId,
      orientation,
      ownedBy,
    };
  };

  return {
    increment,
    mudGetEntityType,
    mudGetOwnedBy,
    mudGetOrientation,
    mudGetPosition,
    mudPositionToEntityKey,
    mudIsPositionEmpty,
    mudBuildFacility,
    mudGetEntityMetadataAtPosition,
  };
}
