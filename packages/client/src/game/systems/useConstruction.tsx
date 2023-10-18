import { useMUD } from "@/useMUD";
import { Vector3 } from "three";
import { getState } from "../store";
import {
  buildFacility,
  canAffordBuilding,
  canBuildAtPosition,
} from "./constructionSystem";
import { queueAsyncCall } from "../utils/asyncQueue";
import { getRandom } from "@/lib/utils";
import { palette } from "../utils/palette";

function useConstruction() {
  const {
    systemCalls: { mudBuildFacility },
  } = useMUD();
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

    const build = [
      building.entityTypeId,
      Math.floor(position.x),
      Math.floor(position.y),
      Math.floor(position.z),
      yaw,
      color,
      variant,
    ];
    if (canBuildAtPosition(position) && canAffordBuilding(building)) {
      queueAsyncCall(async () => {
        console.trace("buildFacility hook", position, build);
        try {
          const result = await mudBuildFacility(...build);
          console.log("mudBuildFacility result", result);
        } catch (error) {
          console.error("mudBuildFacility error", error);
        }
      });
      buildFacility({
        position,
        building,
        yaw,
        levelInit: false,
        variant,
        color,
      });
    } else {
      console.error("Cannot build here", position);
    }
  };

  return { constructFacility };
}

export default useConstruction;
