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

function GameLoop() {
  const {
    components: { Position, EntityType },
  } = useMUD();
  const {
    player: { setPlayerState, gameLoaded, audioContextCanStart },
    world: { getEntityByPosition },
  } = useStore();

  // Startup
  useOnce(() => {
    for (let i = 0; i < 10; i++) {
      const { createResource, randomEmptyPosition } = resourceFactory();
      const position = randomEmptyPosition();
      createResource(EntityData.resources.crystalFloat, position!);
    }
  });

  // Delayed start for audiocontexts
  useEffect(() => {
    const startAudioContexts = () => {
      if (!audioContextCanStart) {
        setPlayerState({ audioContextCanStart: true });
      }
    };

    document.addEventListener("click", startAudioContexts);
    return () => {
      document.removeEventListener("click", startAudioContexts);
    };
  }, [audioContextCanStart, setPlayerState]);

  const facilities = useEntityQuery([Has(Position), Has(EntityType)]).map(
    (entity) => {
      const pos = getComponentValueStrict(Position, entity);
      const type = getComponentValueStrict(EntityType, entity);
      const e = {
        entity,
        typeId: type.typeId,
        pos,
        position: new Vector3(pos.x, pos.y, pos.z),
      };
      return e;
    }
  );

  useEffect(() => {
    // we're going to check which entities don't exist yet and build new ones:
    // TODO: GameLoaded logic breaks when the map has zero entities [bug]
    if (facilities.length < 1) return;
    for (const facility of facilities) {
      const { entity, typeId, position } = facility;
      if (!getEntityByPosition(position)) {
        const building = Object.values(EntityData.facilities).find(
          (f) => f.entityTypeId === typeId || ""
        );
        if (!position || !building) {
          console.error("Entity has no position", entity);
          continue;
        }
        buildFacility(position, building);
      }
    }
    if (!gameLoaded) {
      console.log("Game loaded");
      const event = new Event("gameLoaded");
      document.dispatchEvent(event);
      setPlayerState({ gameLoaded: true, startTime: Date.now() });
    }
  }, [facilities, setPlayerState, getEntityByPosition, gameLoaded]);

  return <></>;
}

export default GameLoop;
