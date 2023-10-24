import { Vector3 } from "three";
import { getState } from "../store";
import {
  buildFacility,
  canAffordBuilding,
  canBuildAtPosition,
} from "./constructionSystem";
import { getRandom } from "@/lib/utils";
import { palette } from "../utils/palette";

function useConstruction() {
  const {
    input: { building },
  } = getState();

  const constructFacility = async (position: Vector3) => {
    if (!building) return;
    const {
      input: { cursor },
    } = getState();

    const color =
      (cursor.color && cursor.color.includes("#")
        ? cursor.color
        : getRandom(palette.buildingSecondary)) || "#ffffff";
    const variant = cursor.variant;
    const yaw = cursor.yaw || 0;
    const owner = getState().player.playerData.address;
    if (canBuildAtPosition(position) && canAffordBuilding(building)) {
      buildFacility({
        position,
        building,
        yaw,
        levelInit: false,
        variant,
        color,
        owner,
      });
    } else {
      console.error("Cannot build here", position);
    }
  };

  return { constructFacility };
}

export default useConstruction;
