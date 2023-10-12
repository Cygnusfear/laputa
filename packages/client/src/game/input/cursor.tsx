import { useEffect, useRef, useState } from "react";
import { Sparkles } from "@react-three/drei";
import { AdditiveBlending, DoubleSide } from "three";

import { useStore } from "../store";
import { palette } from "../utils/palette";
import { faceDirections } from "@/lib/utils";
import { canBuildAtPosition } from "../systems/constructionSystem";

function Cursor() {
  const cursorRef = useRef<THREE.Mesh>(null);
  const {
    input: {
      cursor: { position, cursorState, direction, setCursor },
      building,
    },
    assets: { textures },
  } = useStore();
  const [faceIndex, setFaceIndex] = useState(0);

  useEffect(() => {
    if (direction) {
      const idx = faceDirections.findIndex((dir) => dir.equals(direction));
      setFaceIndex(idx);
    }
  }, [direction]);

  useEffect(() => {
    if (building) {
      if (!canBuildAtPosition(position)) {
        setCursor({ cursorState: "invalid" });
      } else {
        setCursor({ cursorState: "valid" });
      }
    } else {
      setCursor({ cursorState: "hidden" });
    }
  }, [cursorState, building, position, setCursor]);

  return (
    <group
      position={position.toArray()}
      visible={cursorState !== "hidden"}
      scale={[0.95, 0.95, 0.95]}
      layers={30}
    >
      <mesh userData={{ type: "cursor" }} ref={cursorRef}>
        <boxGeometry args={[1, 1]} />
        {/* Face mapping for direction */}
        {[...Array(6)].map((_, index) => (
          <meshLambertMaterial
            attach={`material-${index}`}
            key={index}
            color={
              cursorState === "valid" ? palette.cursor : palette.cursorInvalid
            }
            visible={faceIndex !== undefined && faceIndex === index}
            transparent={true}
            opacity={0.3}
            blending={AdditiveBlending}
            side={DoubleSide}
          />
        ))}
        <Sparkles
          count={7}
          scale={1.15}
          size={2.6}
          visible={cursorState === "valid"}
        />
      </mesh>
      {/* 🐁 main cursor block */}
      <mesh visible={cursorState === "valid"}>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshStandardMaterial
          map={textures["box01"]}
          color={
            cursorState === "valid" ? palette.cursor : palette.cursorInvalid
          }
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
