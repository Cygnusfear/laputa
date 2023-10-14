import { useEffect, useRef, useState } from "react";
import { PositionalAudio } from "@react-three/drei";
import type { PositionalAudio as PositionalAudioImpl } from "three";
import { getRandom } from "@/lib/utils";
import { useStore } from "../store";

const vol = 0.5;

const files = ["/audio/plop00.wav", "/audio/plop01.wav"];

export const Sound = ({
  play,
  volume,
  source,
}: {
  play: boolean;
  volume: number;
  source: string;
}) => {
  const ref = useRef<PositionalAudioImpl>(null!);
  const {
    player: { gameLoaded, audioContextCanStart },
  } = useStore();

  useEffect(() => {
    const doPlay = () => {
      if (!gameLoaded && audioContextCanStart) return;
      if (!ref.current.isPlaying) {
        ref.current.setVolume(volume);
        ref.current.play();
      }
    };

    doPlay();
  }, [gameLoaded, audioContextCanStart, play, volume]);

  return <PositionalAudio ref={ref} url={source} distance={5} loop={false} />;
};

export const FacilitySound = () => {
  const [audio] = useState(getRandom(files));

  return <Sound source={audio} play={true} volume={vol} />;
};
