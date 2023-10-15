import { useMUD } from "@/useMUD";
import { Vector3 } from "three";
import { getState } from "../store";
import { buildFacility, canBuildAtPosition } from "./constructionSystem";
import { queueAsyncCall } from "../utils/asyncQueue";

function useConstruction() {
  const {
    systemCalls: { mudBuildFacility },
  } = useMUD();
  const {
    input: { building },
  } = getState();

  const constructFacility = async (position: Vector3) => {
    if (!building) return;
    const build = [
      building.entityTypeId,
      Math.floor(position.x),
      Math.floor(position.y),
      Math.floor(position.z),
      Math.floor(Math.random() * 360),
    ];
    if (canBuildAtPosition(position)) {
      queueAsyncCall(async () => {
        console.trace("buildFacility hook", position);
        console.log(build);
        try {
          const result = await mudBuildFacility(...build);
          console.log("mudBuildFacility result", result);
        } catch (error) {
          console.error("mudBuildFacility error", error);
        }
      });
      buildFacility(position, building, false, build[4]);
    } else {
      console.error("Cannot build here", position);
    }
  };

  return { constructFacility };
}

export default useConstruction;
