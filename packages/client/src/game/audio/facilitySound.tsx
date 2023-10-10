import { useEffect, useRef } from "react";
import { PositionalAudio } from "@react-three/drei";
import type { PositionalAudio as PositionalAudioImpl } from "three";

const vol = 0.1;

export const FacilitySound = () => {
  const ref = useRef<PositionalAudioImpl>(null!);

  const handleClick = () => {
    if (!ref.current.isPlaying) {
      ref.current.setVolume(vol);
      ref.current.play();
    }
  };

  useEffect(() => {
    handleClick();
  }, []);

  return (
    <PositionalAudio
      ref={ref}
      url="/audio/plop.wav"
      distance={5}
      loop={false}
    />
  );
};
