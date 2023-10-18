import GameScene from "@/game/gameScene";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping, Color } from "three";

import GameUI from "@/components/ui/gameUI";
import Importer from "./utils/importer";
import GameLoop from "./systems/gameLoop";
import { Stats } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { useMUD } from "@/useMUD";
import { initializePlayer, savePlayer } from "./data/player";
import { getState } from "./store";

function GameRoot() {
  const [showFps, setShowFps] = useState(false);
  const {
    network: {
      walletClient: { account },
    },
  } = useMUD();

  useMemo(() => {
    const player = initializePlayer({ address: account.address });
    getState().player.setPlayerData(player);
  }, [account]);

  useMemo(() => {
    const toggleFPS = () => {
      setShowFps(!showFps);
    };

    Object.assign(window, { showFps: toggleFPS });
  }, [showFps]);

  useEffect(() => {
    const interval = setInterval(() => {
      savePlayer(getState().player.playerData);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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
