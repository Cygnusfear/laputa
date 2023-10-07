import { useEffect, useRef } from "react";
import {
  OrbitControls,
  OrbitControlsProps,
  PerspectiveCamera,
} from "@react-three/drei";

function Camera() {
  const orbitRef = useRef<OrbitControlsProps>(null!);

  const setCameraAngle = () => {
    if (orbitRef && orbitRef.current !== null) {
      // @ts-ignore
      orbitRef.current.setPolarAngle(Math.PI / 3);
      orbitRef.current.maxPolarAngle = Infinity;
    }
  };

  useEffect(() => {
    setCameraAngle();
  }, [orbitRef]);

  useEffect(() => {
    window.addEventListener("gameLoaded", setCameraAngle);
    return () => {
      window.removeEventListener("gameLoaded", setCameraAngle);
    };
  }, []);

  return (
    <>
      <PerspectiveCamera position={[0, 50, 50]} fov={35} />
      <OrbitControls
        target={[0, 0, 0]}
        minDistance={12}
        maxDistance={100}
        maxPolarAngle={Math.PI / 3.5}
        // @ts-ignore
        ref={orbitRef}
      />
    </>
  );
}

export default Camera;
