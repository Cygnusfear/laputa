import { useRef } from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";

function Camera() {
  const orbitRef = useRef();
  return (
    <>
      <PerspectiveCamera position={[0, 50, 50]} fov={35} />;
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
