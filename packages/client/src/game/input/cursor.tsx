import { useEffect, useMemo, useRef, useState } from "react";
import { Sparkles } from "@react-three/drei";
import { AdditiveBlending, DoubleSide } from "three";

import { getState, useStore } from "../store";
import { palette } from "../utils/palette";
import { degreesToRadians, faceDirections } from "@/lib/utils";
import {
  canAffordBuilding,
  canBuildAtPosition,
} from "../systems/constructionSystem";

function Cursor() {
  const cursorRef = useRef<THREE.Mesh>(null);
  const {
    input: {
      cursor: { position, cursorState, direction },
      building,
    },
    assets: { textures },
  } = useStore();

  const faceIndex = useMemo(() => {
    if (direction) {
      const idx = faceDirections.findIndex((dir) => dir.equals(direction));
      return idx;
    }
  }, [direction]);

  useEffect(() => {
    const { setCursor } = getState().input.cursor;
    if (building) {
      if (!canBuildAtPosition(position) || !canAffordBuilding(building)) {
        setCursor({ cursorState: "invalid" });
      } else {
        setCursor({ cursorState: "valid" });
      }
    } else {
      setCursor({ cursorState: "hidden" });
    }
  }, [cursorState, building, position]);

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
      {building && <FacilityGhostRender />}
    </group>
  );
}

function FacilityGhostRender() {
  const {
    assets: { meshes },
    input: {
      building,
      cursor: { yaw, variant: variantIndex, cursorState },
    },
  } = useStore();
  const [rotation, setRotation] = useState([0, degreesToRadians(yaw), 0]);
  const variant = building?.variants[variantIndex!];
  const prototypes = useMemo(
    () =>
      Object.values(meshes).filter(
        (mesh) => variant?.nodes.includes(mesh.name)
      ),
    [meshes, variant]
  );
  useEffect(() => {
    setRotation([0, degreesToRadians(yaw), 0]);
  }, [yaw]);

  return (
    <group
      layers={30}
      dispose={null}
      scale={[1, 1, 1]}
      position={[0, 0, 0]}
      matrixAutoUpdate={false}
      matrixWorldAutoUpdate={false}
    >
      {prototypes!.map((proto, index) => {
        const color = palette.cursor;
        return (
          <mesh
            dispose={null}
            // @ts-ignore
            rotation={rotation}
            position={[0, 0, 0]}
            key={index}
            geometry={proto.geometry}
            receiveShadow
            castShadow
          >
            <meshStandardMaterial
              attach={`material`}
              color={cursorState === "valid" ? color : palette.cursorInvalid}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default Cursor;
