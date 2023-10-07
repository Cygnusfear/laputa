import GameScene from "@/game/gameScene";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, Color } from "three";

import GameUI from "@/components/ui/gameUI";
import Importer from "./utils/importer";

function GameRoot() {
  return (
    <>
      <Canvas
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = ACESFilmicToneMapping;
          gl.setClearColor(new Color("#76ADAB"));
        }}
      >
        <Importer />
        <GameScene />
      </Canvas>
      <GameUI />
    </>
  );
}

export default GameRoot;
