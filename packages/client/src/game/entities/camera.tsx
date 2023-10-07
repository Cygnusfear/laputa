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
      orbitRef.current.maxPolarAngle = Infinity;
      // @ts-ignore
      orbitRef.current.setPolarAngle(Math.PI / 3);
    }
  };

  useEffect(() => {
    setCameraAngle();
  }, [orbitRef]);

  useEffect(() => {
    document.addEventListener("gameLoaded", setCameraAngle);
    return () => {
      document.removeEventListener("gameLoaded", setCameraAngle);
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
