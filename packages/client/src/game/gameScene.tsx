import { useFrame, useThree } from "@react-three/fiber";

import Camera from "./entities/camera";
import Ground from "./entities/ground";
import Cursor from "./input/cursor";
import { useStore } from "./store";
import Facility from "./entities/facility";
import { IFacility, IResource } from "./types/entities";
import Background from "./entities/background";
import Resource from "./entities/resource";
import { Suspense } from "react";

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
      <Suspense fallback={null}>
        <Camera />
      </Suspense>
      <ambientLight intensity={1.2} />
      <directionalLight castShadow position={[5, 8, 5]} intensity={2.5} />
      <directionalLight castShadow position={[-5, 8, 5]} intensity={2.5} />
      <Background />
      <Ground />
      <Suspense fallback={null}>
        {entities.map((entity, idx) => {
          switch (entity.entityType) {
            case "facility":
              return <Facility key={idx} {...(entity as IFacility)} />;
            case "resource":
              return <Resource key={idx} {...(entity as IResource)} />;
            default:
              return null;
          }
        })}
      </Suspense>
      <Cursor />
    </scene>
  );
}

export default GameScene;
