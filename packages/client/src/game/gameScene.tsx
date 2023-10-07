import { useFrame, useThree } from "@react-three/fiber";

import Camera from "./entities/camera";
import Ground from "./entities/ground";
import Cursor from "./input/cursor";
import { useStore } from "./store";
import Facility from "./entities/facility";
import { IFacility } from "./entities/entities";

let loaded = false;

function GameScene() {
  const { clock } = useThree();
  const {
    world: { entities },
  } = useStore();

  useFrame(() => {
    if (clock.elapsedTime > 0 && !loaded) {
      loaded = true;
      const event = new Event("gameLoaded");
      document.dispatchEvent(event);
    }
  });

  return (
    <scene>
      <Camera />
      <ambientLight intensity={1.2} />
      <Ground />
      {entities.map((entity, idx) => {
        const factility = entity as IFacility;
        return <Facility key={idx} {...factility} />;
      })}
      <Cursor />
    </scene>
  );
}

export default GameScene;
