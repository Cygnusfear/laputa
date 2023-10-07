import { useRef } from "react";
import { Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { useStore } from "../store";

function Cursor() {
  const cursorRef = useRef<THREE.Mesh>(null);
  const {
    input: {
      cursor: { position, cursorState },
    },
  } = useStore();

  useFrame(() => {
    //   if (cursorRef.current) {
    //   }
  });

  return (
    <mesh
      position={position.toArray()}
      rotation={[-Math.PI / 2, 0, 0]}
      userData={{ type: "cursor" }}
      visible={cursorState !== "hidden"}
      ref={cursorRef}
    >
      <boxGeometry args={[1, 1]} />
      <meshStandardMaterial
        color={"#76EAE4"}
        blending={THREE.AdditiveBlending}
        transparent
        attach="material"
        opacity={0.2}
      />
      <Sparkles
        count={10}
        scale={1.5}
        size={3.6}
        visible={cursorState !== "hidden"}
      />
    </mesh>
  );
}

export default Cursor;
