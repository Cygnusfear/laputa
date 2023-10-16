import { useMUD } from "@/useMUD";
import { Vector3 } from "three";
import { getState } from "../store";
import { buildFacility, canBuildAtPosition } from "./constructionSystem";
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
    const variant = 0;
    const yaw = Math.floor(Math.random() * 360);

    const build = [
      building.entityTypeId,
      Math.floor(position.x),
      Math.floor(position.y),
      Math.floor(position.z),
      yaw,
      color,
      variant,
    ];
    console.log(build);
    if (canBuildAtPosition(position)) {
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
