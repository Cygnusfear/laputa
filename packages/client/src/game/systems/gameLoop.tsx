import { useEffect } from "react";
import resourceFactory from "./resourceFactory";
import EntityData from "../data/entities";
import { useMUD } from "@/useMUD";
import { Vector3 } from "three";
import { buildFacility } from "./constructionSystem";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { getState } from "../store";
import { useOnce } from "@/lib/useOnce";
import { createNewPlayerData, savePlayer } from "../data/player";

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
  } = useMUD();

  // Startup
  useOnce(() => {
    for (let i = 0; i < 10; i++) {
      const { createResource, randomEmptyPosition } = resourceFactory();
      const position = randomEmptyPosition();
      createResource(EntityData.resources.crystalFloat, position!);
    }
  });

  useEffect(() => {
    const { setCursor, yaw, variant } = getState().input.cursor;
    const rotation = 90;

    const normalizeAngle = (angle: number) => {
      const normalized = angle % 360;
      return Math.floor(normalized < 0 ? normalized + 360 : normalized);
    };

    const rotateCursor = (amount: number) => {
      const rot = normalizeAngle(yaw + amount * rotation);
      setCursor({ yaw: rot });
      console.log(rot, yaw);
    };

    const nextVariant = () => {
      const length = getState().input.building?.variants.length || 0;
      const next = (variant + 1) % length;
      setCursor({ variant: next });
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
        getState().player.addResources([
          { resource: "LAPU", amount: 1000 },
          { resource: "crystal", amount: 5 },
          { resource: "power", amount: 15 },
          { resource: "gravity", amount: 15 },
        ]);
      }
      if (e.key === "y") {
        const newPlayer = createNewPlayerData({
          address: getState().player.playerData.address,
        });
        savePlayer(newPlayer);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
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
    const { owner } = getComponentValueStrict(OwnedBy, entity);
    const e = {
      entity,
      typeId: type.typeId,
      pos,
      position: new Vector3(pos.x, pos.y, pos.z),
      yaw: orientation.yaw,
      color: customization.color,
      variant: customization.variant,
      owner,
    };
    return e;
  });

  useEffect(() => {
    // Debug for hiding the loading screen on new world
    // const event = new Event("gameLoaded");
    // document.dispatchEvent(event);

    // we're going to check which entities don't exist yet and build new ones:
    // TODO: GameLoaded logic breaks when the map has zero entities [bug]
    for (const facility of facilities) {
      const { entity, typeId, position, yaw, color, variant } = facility;
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
          owner: facility.owner,
        });
        loaded = true;
      }
    }
    if (loaded) {
      const event = new Event("gameLoaded");
      document.dispatchEvent(event);
    }
  }, [facilities]);

  return <></>;
}

export default GameLoop;
