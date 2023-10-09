import { useEffect } from "react";
import resourceFactory from "./resourceFactory";
import EntityData from "../data/entities";

function GameLoop() {
  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      const { createResource, randomEmptyPosition } = resourceFactory();
      const position = randomEmptyPosition();
      createResource(EntityData.resources.crystalFloat, position!);
    }
  }, []);

  return <></>;
}

export default GameLoop;
