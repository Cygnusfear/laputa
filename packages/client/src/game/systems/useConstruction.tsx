import { useMUD } from "@/useMUD";
import { Vector3 } from "three";
import { getState } from "../store";
import { buildFacility } from "./constructionSystem";
import { queueAsyncCall } from "../utils/asyncQueue";

function useConstruction() {
  const {
    systemCalls: {
      // mudIsPositionEmpty,
      mudBuildFacility,
      // mudGetEntityMetadataAtPosition,
    },
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
      0,
    ];
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
    buildFacility(position);
  };

  return { constructFacility };
}

export default useConstruction;
