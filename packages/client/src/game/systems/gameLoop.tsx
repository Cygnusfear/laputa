import { useEffect } from "react";
import resourceFactory from "./resourceFactory";
import EntityData from "../data/entities";
import { useStore } from "../store";

function GameLoop() {
  const {
    world: { entities },
  } = useStore();
  useEffect(() => {
    setInterval(() => {
      console.log("Game loop");
      if (
        entities.filter((entity) => entity.entityType === "resource")?.length <
        10
      ) {
        const { createResource, randomEmptyPosition } = resourceFactory();
        const position = randomEmptyPosition();
        createResource(EntityData.resources.crystalFloat, position!);
      }
    }, 5000);
  }, [entities]);

  return <></>;
}

export default GameLoop;
