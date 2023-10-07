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
    assets: { textures },
  } = useStore();
  const [faceIndex, setFaceIndex] = useState(0);

  useEffect(() => {
    if (direction) {
      const idx = faceDirections.findIndex((dir) => dir.equals(direction));
      setFaceIndex(idx);
      console.log(idx);
    }
  }, [direction]);

  return (
    <group position={position.toArray()} visible={cursorState !== "hidden"}>
      <mesh userData={{ type: "cursor" }} ref={cursorRef}>
        <boxGeometry args={[0.96, 0.96]} />
        {/* Face mapping for direction */}
        {[...Array(6)].map((_, index) => (
          <meshLambertMaterial
            attach={`material-${index}`}
            key={index}
            color={palette.cursor}
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
      </mesh>
      {/* 🐁 main cursor block */}
      <mesh>
        <boxGeometry args={[0.99, 0.99, 0.99]} />
        <meshStandardMaterial
          map={textures["box01"]}
          color={"#76EAE4"}
          transparent
          attach="material"
          opacity={0.1}
          blending={AdditiveBlending}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default Cursor;
