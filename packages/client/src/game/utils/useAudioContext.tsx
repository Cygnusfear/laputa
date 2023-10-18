import { useEffect, useState } from "react";

function useAudioContext() {
  const [gameLoaded, setGameLoaded] = useState(false);
  const [audioContextCanStart, setAudioContextStart] = useState(false);

  useEffect(() => {
    const loaded = () => {
      setGameLoaded(true);
    };

    const contextStart = () => {
      setAudioContextStart(true);
    };

    document.addEventListener("gameLoaded", loaded);
    document.addEventListener("click", contextStart);

    return () => {
      document.removeEventListener("gameLoaded", loaded);
      document.removeEventListener("click", contextStart);
    };
  }, []);

  return { gameLoaded, audioContextCanStart };
}

export { useAudioContext };
