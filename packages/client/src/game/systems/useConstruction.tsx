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
import { useEffect } from "react";

function useConstruction() {
  const {
    systemCalls: {
      mudBuildFacility,
      mudDefiConsumesLapuFromPlayer,
      approveLapuToMudWorldForTheConnectedPlayer,
    },
  } = useMUD();
  const {
    input: { building },
    player: {
      playerData: { address },
    },
  } = getState();

  useEffect(() => {
    const approveOnLaunch = async () => {
      const amount = 100000;
      console.log("approveOnLaunch", address, amount);
      approveLapuToMudWorldForTheConnectedPlayer(amount);
    };

    if (address !== "") {
      approveOnLaunch();
    }
  }, [address, approveLapuToMudWorldForTheConnectedPlayer]);

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

    const build = [
      building.entityTypeId,
      Math.floor(position.x),
      Math.floor(position.y),
      Math.floor(position.z),
      yaw,
      color,
      variant,
      owner,
    ];
    if (canBuildAtPosition(position) && canAffordBuilding(building)) {
      queueAsyncCall(async () => {
        console.trace("buildFacility hook", position, build);
        try {
          const cost = building.costs.find((cost) => cost[0] === "LAPU");
          if (cost) {
            console.log(cost[1]);
            const consume = await mudDefiConsumesLapuFromPlayer(
              cost[1],
              getState().player?.playerData?.address
            );
            console.log(consume);
          }
          // @ts-ignore
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
        owner,
      });
    } else {
      console.error("Cannot build here", position);
    }
  };

  return { constructFacility };
}

export default useConstruction;
