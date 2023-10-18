import { useEffect, useRef } from "react";
import { CameraControls, PerspectiveCamera } from "@react-three/drei";
import { BackgroundMusic } from "../audio/backgroundMusic";
import { Group } from "three";
import useCameraMoveHook from "../utils/useCameraMove";

function Camera() {
  const groupRef = useRef<Group>(null!);
  const orbitRef = useRef<CameraControls>(null!);

  const setCameraAngle = () => {
    if ("current" in orbitRef) {
      orbitRef.current.maxPolarAngle = Infinity;
      orbitRef.current.minDistance = 7;
      orbitRef.current.polarAngle = Math.PI / 2;
      orbitRef.current.setPosition(7.894977, 6.020706, 10.526502);
      console.log("camera set");
      Object.assign(window, { cam: orbitRef.current });
    }
  };

  useEffect(() => {
    setCameraAngle();
  }, []);

  useCameraMoveHook(orbitRef);

  return (
    <group ref={groupRef}>
      <PerspectiveCamera position={[0, 50, 50]} fov={35}>
        <BackgroundMusic />
      </PerspectiveCamera>
      <CameraControls
        minDistance={7}
        maxDistance={100}
        maxPolarAngle={Math.PI / 3.5}
        ref={orbitRef}
      />
    </group>
  );
}

export default Camera;
