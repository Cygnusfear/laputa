import { useEffect, useMemo } from "react";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { SyncStep } from "@latticexyz/store-sync";
import resourceFactory from "./resourceFactory";
import EntityData from "../data/entities";
import { useMUD } from "@/useMUD";
import { Vector3 } from "three";
import { buildFacility } from "./constructionSystem";
import { useComponentValue, useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { getState } from "../store";
import { useOnce } from "@/lib/useOnce";
import { savePlayer } from "../data/player";
import { evaluateTutorials, tutorialSteps } from "../data/tutorial";

let loaded = false;

function GameLoop() {
  const {
    components: {
      Position,
      EntityType,
      Orientation,
      EntityCustomization,
      OwnedBy,
    },
    network: {
      components: { SyncProgress },
    },
  } = useMUD();

  const syncProgress = useComponentValue(SyncProgress, singletonEntity, {
    message: "Connecting",
    percentage: 0,
    step: SyncStep.INITIALIZE,
    latestBlockNumber: 0n,
    lastBlockNumberProcessed: 0n,
  });

  // Startup
  useOnce(() => {
    for (let i = 0; i < 10; i++) {
      const { createResource, randomEmptyPosition } = resourceFactory();
      const position = randomEmptyPosition();
      createResource(EntityData.resources.crystalFloat, position!);
    }
  });

  useEffect(() => {
    const rotation = 90;

    const normalizeAngle = (angle: number) => {
      const normalized = angle % 360;
      return Math.floor(normalized < 0 ? normalized + 360 : normalized);
    };

    const rotateCursor = (amount: number) => {
      const rot = normalizeAngle(
        getState().input.cursor.yaw + amount * rotation
      );
      getState().input.cursor.setCursor({ yaw: rot });
    };

    const rotateRight = () => {
      rotateCursor(1);
    };

    const rotateLeft = () => {
      rotateCursor(-1);
    };

    const nextVariant = () => {
      const length = getState().input.building?.variants.length || 0;
      const next = (getState().input.cursor.variant + 1) % length;
      getState().input.cursor.setCursor({ variant: next });
    };

    const newPlayer = () => {
      // localStorage.removeItem("playerData");
      localStorage.clear();
      location.reload();
      // getState().player.setPlayerData(createNewPlayerData({}));
    };

    const cheat = () => {
      getState().player.addResources([
        { resource: "LAPU", amount: 1000 },
        { resource: "crystal", amount: 5 },
        { resource: "power", amount: 15 },
        { resource: "gravity", amount: 15 },
      ]);
      savePlayer(getState().player.playerData!);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "q") {
        rotateCursor(-1);
      }
      if (e.key === "e") {
        rotateCursor(1);
      }
      if (e.key === "r") {
        nextVariant();
      }
      if (e.key === "t") {
        cheat();
      }
      if (e.key === "y") {
        newPlayer();
        console.log("Debug -> Reset player");
      }
      if (e.key === "u") {
        const activeTutorial = "making money";
        getState().player.setPlayerData({
          ...getState().player.playerData,
          finishedTutorials: ["intro"],
          activeTutorials: [activeTutorial],
        });
        console.log("Debug -> Set player tutorials to wallet generation");
      }

      e.stopPropagation();
    };

    Object.assign(window, { idkfa: cheat, newPlayer });

    document.addEventListener("rotateRight", rotateRight);
    document.addEventListener("rotateLeft", rotateLeft);
    document.addEventListener("nextVariant", nextVariant);
    document.addEventListener("keyup", handleKeyDown);
    return () => {
      document.removeEventListener("keyup", handleKeyDown);
      document.removeEventListener("rotateRight", rotateRight);
      document.removeEventListener("rotateLeft", rotateLeft);
      document.removeEventListener("nextVariant", nextVariant);
    };
  }, []);

  const facilities = useEntityQuery([
    Has(Position),
    Has(EntityType),
    Has(Orientation),
    Has(EntityCustomization),
    Has(OwnedBy),
  ]).map((entity) => {
    const pos = getComponentValueStrict(Position, entity);
    const orientation = getComponentValueStrict(Orientation, entity);
    const type = getComponentValueStrict(EntityType, entity);
    const customization = getComponentValueStrict(EntityCustomization, entity);
    const ownedBy = getComponentValueStrict(OwnedBy, entity);
    const e = {
      entity,
      typeId: type.typeId,
      pos,
      position: new Vector3(pos.x, pos.y, pos.z),
      yaw: orientation.yaw,
      color: customization.color,
      variant: customization.variant,
      owner: ownedBy.owner,
    };
    return e;
  });

  useMemo(() => {
    for (const facility of facilities) {
      const { entity, typeId, position, yaw, color, variant, owner } = facility;
      if (!getState().world.getEntityByPosition(position)) {
        const building = Object.values(EntityData.facilities).find(
          (f) => f.entityTypeId === typeId || ""
        );
        if (!position || !building) {
          console.error("Entity has no position", entity);
          continue;
        }
        buildFacility({
          position,
          building,
          levelInit: true,
          yaw,
          color,
          variant,
          owner,
        });
      }
    }
    if (syncProgress.percentage === 100 && !loaded) {
      loaded = true;
      const event = new Event("gameLoaded");
      document.dispatchEvent(event);
    }
  }, [facilities, syncProgress.percentage]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        loaded &&
        getState().player.playerData.finishedTutorials.length <
          tutorialSteps.length
      ) {
        evaluateTutorials();
        savePlayer(getState().player.playerData);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return <></>;
}

export default GameLoop;
