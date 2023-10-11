import Camera from "./entities/camera";
import Ground from "./entities/ground";
import Cursor from "./input/cursor";
import { useStore } from "./store";
import Facility from "./entities/facility";
import { IFacility, IResource } from "./types/entities";
import Background from "./entities/background";
import Resource from "./entities/resource";
import { Suspense } from "react";

function GameScene() {
  const {
    world: { entities },
  } = useStore();

  return (
    <scene>
      <ambientLight intensity={1.2} />
      <directionalLight castShadow position={[5, 8, 5]} intensity={2.5} />
      <directionalLight castShadow position={[-5, 8, 5]} intensity={2.5} />
      <Suspense fallback={null}>
        <Background />
        <Camera />
        <Ground />
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
