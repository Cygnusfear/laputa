import GameScene from "@/game/gameScene";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, Color } from "three";

import GameUI from "@/components/ui/gameUI";

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
        <GameScene />
      </Canvas>
      <GameUI />
    </>
  );
}

export default GameRoot;
