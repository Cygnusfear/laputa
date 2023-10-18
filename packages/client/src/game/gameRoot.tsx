import GameScene from "@/game/gameScene";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, Color } from "three";

import GameUI from "@/components/ui/gameUI";
import Importer from "./utils/importer";
import GameLoop from "./systems/gameLoop";
import { Stats } from "@react-three/drei";
import { useMemo, useState } from "react";

function GameRoot() {
  const [showFps, setShowFps] = useState(false);

  useMemo(() => {
    const toggleFPS = () => {
      setShowFps(!showFps);
    };

    Object.assign(window, { showFps: toggleFPS });
  }, [showFps]);

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
        {showFps && <Stats />}
      </Canvas>
      <GameUI />
    </>
  );
}

export default GameRoot;
