import { Vector3 } from "three";
import { getState } from "../store";
import { createRef } from "react";
import { degreesToRadians, getRandom } from "@/lib/utils";
import { palette } from "../utils/palette";
import { IFacility } from "../types/entities";
import { floodFill } from "../utils/floodFill";
import { FacilityDataType } from "../data/entities";

// TODO: Extract build conditions, can't build 1 tile below gravity well, only gravity well can build at y==1, etc
const canBuildAtPosition = (position: Vector3) => {
  const {
    input: { building },
  } = getState();
  if (position.y < 0) return false;
  const { getEntityByPosition } = getState().world;
  const entity = getEntityByPosition(position);
  if (entity) return false;
  if (building && !building.tags.includes("groundLevel") && position.y < 1) {
    return false;
  }
  return true;
};

const getEntityInDirection = (position: Vector3, direction: Vector3) => {
  const { getEntityByPosition } = getState().world;
  return getEntityByPosition(position.add(direction));
};

export const canAffordBuilding = (building: FacilityDataType) => {
  const {
    player: { hasResources },
  } = getState();
  return hasResources(
    building.costs.map((c) => {
      return { resource: c[0], amount: c[1] };
    })
  );
};

// TODO: extract input logic from construction system [refactor]
// Should accept a building type as arg
const buildFacility = ({
  position,
  building,
  levelInit = false,
  yaw,
  color,
  variant,
  owner,
}: {
  position: Vector3;
  building: FacilityDataType;
  levelInit: boolean;
  yaw: number;
  color: string;
  variant: number;
  owner: string;
}) => {
  const {
    input: { cursor },
    world: { addEntity },
    player: { spendResouces, addResources },
  } = getState();

  // Move Input logic away from here
  if (!building) {
    console.error("No building selected");
    return;
  }
  // Can afford?
  if (!levelInit) {
    if (!canAffordBuilding(building)) {
      console.error("Sir you have no moolah");
      return;
    }
  }

  if (!canBuildAtPosition(position)) {
    console.error("Cannot build here", position);
    cursor.setCursor({ cursorState: "invalid" });
    return;
  }

  // Use time for seeded random
  const time = Date.now(); // NEED BLOCKTIME
  const rot = yaw;
  const seed =
    (position.x * 10 * position.z * 10 * position.y * time * rot) ^
    (Math.random() * 0x100000000);

  const newFacility: IFacility = {
    entityType: "facility",
    position: position,
    scale: new Vector3(1, 1, 1),
    colorPrimary: getRandom(palette.buildingPrimary),
    colorSecondary: color,
    entityRef: createRef<THREE.Mesh>(),
    rotation: new Vector3(0, degreesToRadians(rot), 0),
    type: building,
    variant: building.variants[variant],
    createdTime: levelInit ? time - 100000 : time, // HACK NEED BLOCKTIME
    gravity: 0,
    seed: seed,
    owner: owner,
  };

  if (!levelInit) {
    const expenses = building.costs.map((c) => {
      return { resource: c[0], amount: c[1] };
    });
    spendResouces(expenses);
    const gains = building.produces.map((c) => {
      return { resource: c[0], amount: c[1] };
    });
    if (gains) addResources(gains);
    console.log("net", gains, expenses);
  }

  addEntity(newFacility);
  propagateGravity();
};

async function propagateGravity() {
  // update the gravity propagation for all wells
  const wells = getState().world.entities.filter((entity) => {
    return (
      entity.entityType === "facility" &&
      (entity as IFacility).type.tags.includes("producesGravity")
    );
  }) as IFacility[];

  for (const entity of getState().world.entities) {
    // zero out so we clean all gravity
    entity.gravity = 0;
  }

  for (const well of wells) {
    const resource = well.type.produces.find((p) => p[0] === "gravity");
    if (resource) {
      const amount = resource[1];
      floodFill(well.position, amount);
    }
  }
}

export { buildFacility, canBuildAtPosition, getEntityInDirection };
