import { Vector3 } from "three";
import { getState } from "../store";
import { createRef } from "react";
import { getRandom } from "@/lib/utils";
import { palette } from "../utils/palette";
import { IFacility } from "../types/entities";

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

const buildFacility = (position: Vector3) => {
  const {
    input: { cursor },
    world: { addEntity },
  } = getState();

  if (!canBuildAtPosition(position)) {
    console.error("Cannot build here", position);
    return;
  }

  const newFacility = {
    position: position,
    scale: new Vector3(Math.random() * 0.3 + 0.7, 1, Math.random() * 0.3 + 0.7),
    colorPrimary: getRandom(palette.buildingPrimary),
    colorSecondary: getRandom(palette.buildingSecondary),
    entityRef: createRef<THREE.Mesh>(),
    rotation: new Vector3(
      0,
      Math.PI * (Math.floor((Math.random() - 0.5) * 4) / 2),
      0
    ),
    // model: getRandom(assets),
    // createdTime: Date.now(),
  } as IFacility;

  addEntity(newFacility);
  cursor.setCursor({ cursorState: "hidden" });
};

export { buildFacility, canBuildAtPosition, getEntityInDirection };
