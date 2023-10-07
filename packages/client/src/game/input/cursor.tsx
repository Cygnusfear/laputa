import { useEffect, useRef, useState } from "react";
import { Sparkles } from "@react-three/drei";
import { AdditiveBlending, DoubleSide } from "three";

import { useStore } from "../store";
import { palette } from "../utils/palette";
import { faceDirections } from "@/lib/utils";

function Cursor() {
  const cursorRef = useRef<THREE.Mesh>(null);
  const {
    input: {
      cursor: { position, cursorState, direction },
    },
  } = useStore();
  const [faceIndex, setFaceIndex] = useState(0);

  useEffect(() => {
    if (direction) {
      const idx = faceDirections.findIndex((dir) => dir.equals(direction));
      setFaceIndex(idx);
    }
  }, [direction]);

  return (
    <mesh
      position={position.toArray()}
      userData={{ type: "cursor" }}
      visible={cursorState !== "hidden"}
      ref={cursorRef}
    >
      <boxGeometry args={[0.99, 0.99]} />
      {/* Face mapping for direction */}
      {[...Array(6)].map((_, index) => (
        <meshLambertMaterial
          attach={`material-${index}`}
          key={index}
          color={
            faceIndex !== undefined && faceIndex === index
              ? palette.cursor
              : "black"
          }
          visible={faceIndex !== undefined && faceIndex === index}
          transparent={true}
          opacity={0.6}
          blending={AdditiveBlending}
          side={DoubleSide}
        />
      ))}
      <Sparkles
        count={10}
        scale={1.5}
        size={3.6}
        visible={cursorState !== "hidden"}
      />
      {/* 🐁 main cursor block */}
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={"#76EAE4"}
          blending={AdditiveBlending}
          transparent
          attach="material"
          opacity={0.1}
        />
      </mesh>
    </mesh>
  );
}

export default Cursor;
