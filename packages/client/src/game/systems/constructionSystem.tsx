import { Vector3 } from "three";
import { getState } from "../store";
import { createRef } from "react";
import { getRandom } from "@/lib/utils";
import { palette } from "../utils/palette";
import { IFacility } from "../types/entities";
import prand from "pure-rand";

const canBuildAtPosition = (position: Vector3) => {
  if (position.y < 0) return false;
  const { getEntityByPosition } = getState().world;
  const entity = getEntityByPosition(position);
  return entity ? false : true;
};

const getEntityInDirection = (position: Vector3, direction: Vector3) => {
  const { getEntityByPosition } = getState().world;
  return getEntityByPosition(position.add(direction));
};

// TODO: extract input logic from construction system [refactor]
// Should accept a building type as arg
const buildFacility = (position: Vector3) => {
  const {
    input: { cursor, building, setInput },
    world: { addEntity },
  } = getState();

  // Move Input logic away from here
  if (!building) {
    console.error("No building selected");
    return;
  }

  if (!canBuildAtPosition(position)) {
    console.error("Cannot build here", position);
    return;
  }

  // Use time for seeded random
  const time = Date.now();
  const rng = prand.xoroshiro128plus(time);

  const newFacility = {
    position: position,
    scale: new Vector3(Math.random() * 0.1 + 0.9, 1, Math.random() * 0.1 + 0.9),
    colorPrimary: getRandom(palette.buildingPrimary),
    colorSecondary: getRandom(palette.buildingSecondary),
    entityRef: createRef<THREE.Mesh>(),
    rotation: new Vector3(
      0,
      Math.PI * (Math.floor((Math.random() - 0.5) * 4) / 2),
      0
    ),
    type: building,
    variant:
      building.variants[
        prand.unsafeUniformIntDistribution(0, building.variants.length - 1, rng)
      ],
    createdTime: time,
  } as IFacility;

  addEntity(newFacility);
  // Move Input logic away from here
  cursor.setCursor({ cursorState: "hidden" });
  setInput({ building: undefined });
  console.log(newFacility);
};

export { buildFacility, canBuildAtPosition, getEntityInDirection };
