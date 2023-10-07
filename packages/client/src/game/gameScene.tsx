import { useFrame, useThree } from "@react-three/fiber";

import Camera from "./entities/camera";
import Ground from "./entities/ground";
import Cursor from "./input/cursor";

let loaded = false;

function GameScene() {
  const { clock } = useThree();

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
      <Cursor />
    </scene>
  );
}

export default GameScene;
