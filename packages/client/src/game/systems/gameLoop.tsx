import { useEffect } from "react";
import resourceFactory from "./resourceFactory";
import EntityData from "../data/entities";
import { useMUD } from "@/useMUD";
import { Vector3 } from "three";
import { buildFacility } from "./constructionSystem";
import { useEntityQuery } from "@latticexyz/react";
import { Has, getComponentValueStrict } from "@latticexyz/recs";
import { useStore } from "../store";
import { useOnce } from "@/lib/useOnce";

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
  const {
    world: { getEntityByPosition },
    input: {
      building,
      cursor: { setCursor, yaw, variant },
    },
    player: { addResources },
  } = useStore();

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
      const rot = normalizeAngle(yaw + amount * rotation);
      setCursor({ yaw: rot });
      console.log(rot, yaw);
    };

    const nextVariant = () => {
      const length = building?.variants.length || 0;
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
        addResources([
          { resource: "LAPU", amount: 1000 },
          { resource: "crystal", amount: 5 },
        ]);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [addResources, building?.variants.length, setCursor, variant, yaw]);

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
    const e = {
      entity,
      typeId: type.typeId,
      pos,
      position: new Vector3(pos.x, pos.y, pos.z),
      yaw: orientation.yaw,
      color: customization.color,
      variant: customization.variant,
    };
    return e;
  });

  useEffect(() => {
    // Debug for hiding the loading screen on new world
    const event = new Event("gameLoaded");
    document.dispatchEvent(event);

    // we're going to check which entities don't exist yet and build new ones:
    // TODO: GameLoaded logic breaks when the map has zero entities [bug]
    for (const facility of facilities) {
      const { entity, typeId, position, yaw, color, variant } = facility;
      if (!getEntityByPosition(position)) {
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
        });
        loaded = true;
      }
    }
    if (loaded) {
      const event = new Event("gameLoaded");
      document.dispatchEvent(event);
    }
  }, [facilities, getEntityByPosition]);

  return <></>;
}

export default GameLoop;
