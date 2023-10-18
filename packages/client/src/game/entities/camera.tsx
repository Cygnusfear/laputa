import { useEffect, useRef } from "react";
import {
  OrbitControls,
  OrbitControlsProps,
  PerspectiveCamera,
} from "@react-three/drei";
import { useOnce } from "@/lib/useOnce";
import { BackgroundMusic } from "../audio/backgroundMusic";

function Camera() {
  const orbitRef = useRef<OrbitControlsProps>(null!);

  const setCameraAngle = () => {
    if (orbitRef && orbitRef.current !== null) {
      orbitRef.current.maxPolarAngle = Infinity;
      // @ts-ignore
      orbitRef.current.setPolarAngle(Math.PI / 3);
    }
  };

  useOnce(() => {
    setCameraAngle();
  });

  useEffect(() => {
    document.addEventListener("gameLoaded", setCameraAngle);
    return () => {
      document.removeEventListener("gameLoaded", setCameraAngle);
    };
  }, []);

  return (
    <>
      <PerspectiveCamera position={[0, 50, 50]} fov={35}>
        <BackgroundMusic />
      </PerspectiveCamera>
      <OrbitControls
        target={[0, 0, 0]}
        minDistance={7}
        maxDistance={100}
        maxPolarAngle={Math.PI / 3.5}
        // @ts-ignore
        ref={orbitRef}
        keys={{
          LEFT: "a", //left arrow
          UP: "w", // up arrow
          RIGHT: "d", // right arrow
          BOTTOM: "s", // down arrow
        }}
      />
    </>
  );
}

export default Camera;
