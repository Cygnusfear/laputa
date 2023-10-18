import { useEffect, useRef, useState } from "react";
import { PositionalAudio } from "@react-three/drei";
import type { PositionalAudio as PositionalAudioImpl } from "three";
import { useAudioContext } from "../utils/useAudioContext";

const vol = 1;

const files = ["/audio/uptone.webm", "/audio/serene.webm"];

export const Sound = ({
  play,
  volume,
  source,
  onEnd,
}: {
  play: boolean;
  volume: number;
  source: string;
  onEnd?: () => void;
}) => {
  const ref = useRef<PositionalAudioImpl>(null!);

  useEffect(() => {
    const doPlay = () => {
      if (!ref.current.isPlaying) {
        ref.current.setVolume(volume);
        ref.current.play();
      }
    };

    doPlay();

    const handleEnd = () => {
      if (onEnd) {
        onEnd();
      }
    };

    const audioRef = ref.current;
    audioRef.addEventListener("ended", handleEnd);
    document.addEventListener("click", doPlay);

    return () => {
      document.removeEventListener("click", doPlay);
      audioRef.removeEventListener("ended", handleEnd);
    };
  }, [play, volume, source, onEnd]);

  return <PositionalAudio ref={ref} url={source} distance={5} loop={false} />;
};

export const BackgroundMusic = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const playNextTrack = () => {
    setTrackIndex((prevIndex) => (prevIndex + 1) % files.length);
  };

  const { audioContextCanStart, gameLoaded } = useAudioContext();

  useEffect(() => {
    if (gameLoaded && audioContextCanStart) {
      setTimeout(() => {
        setGameStarted(true);
      }, 4000);
    }
  }, [gameLoaded, audioContextCanStart]);

  if (!gameStarted || !audioContextCanStart) return null;
  return (
    <Sound
      source={files[trackIndex]}
      play={true}
      volume={vol}
      onEnd={playNextTrack}
    />
  );
};
