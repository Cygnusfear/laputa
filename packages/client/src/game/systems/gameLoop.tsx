import { useEffect } from "react";
import resourceFactory from "./resourceFactory";
import EntityData from "../data/entities";
import { useMUD } from "@/useMUD";
import { Vector3 } from "three";
import { buildFacility } from "./constructionSystem";

function GameLoop() {
  const {
    systemCalls: { mudGetAllFacilityEntityMetadatas },
  } = useMUD();

  // Startup
  useEffect(() => {
    const buildEntities = async () => {
      const entities = await mudGetAllFacilityEntityMetadatas();
      for (const entity of entities) {
        console.log(entity);
        const building = Object.values(EntityData.facilities).find(
          (f) => f.entityTypeId === entity.entityTypeId?.typeId || ""
        );
        if (!entity.position || !building) {
          console.error("Entity has no position", entity);
          continue;
        }
        const position = new Vector3(
          entity.position.x,
          entity.position.y,
          entity.position.z
        );
        buildFacility(position, building);
      }
    };

    for (let i = 0; i < 10; i++) {
      const { createResource, randomEmptyPosition } = resourceFactory();
      const position = randomEmptyPosition();
      createResource(EntityData.resources.crystalFloat, position!);
    }

    buildEntities();
  }, [mudGetAllFacilityEntityMetadatas]);

  return <></>;
}

export default GameLoop;
