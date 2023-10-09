import GameScene from "@/game/gameScene";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, Color } from "three";

import GameUI from "@/components/ui/gameUI";
import Importer from "./utils/importer";
import GameLoop from "./systems/gameLoop";

function GameRoot() {
  return (
    <>
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.setClearColor(new Color("#76ADAB"));
        }}
      >
        <Importer />
        <GameLoop />
        <GameScene />
      </Canvas>
      <GameUI />
    </>
  );
}

export default GameRoot;
