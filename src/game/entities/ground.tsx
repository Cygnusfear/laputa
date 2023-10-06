import { createRef } from "react";
import { Grid, GridProps } from "@react-three/drei";

const gridSize = 1000;

function GridRenderer() {
  const gridConfig = {
    cellSize: 1,
    cellThickness: 0.9,
    cellColor: "#76EAE4",
    sectionSize: 5,
    sectionThickness: 1,
    sectionColor: "#76EAE4",
    fadeDistance: 40,
    fadeStrength: 2,
    followCamera: true,
    infiniteGrid: true,
    depthTest: false,
  } as GridProps;
  return <Grid position={[0.5, 0, 50.5]} args={[30.5, 30.5]} {...gridConfig} />;
}

function Ground() {
  const gridRef = createRef<THREE.Mesh>();

  return (
    <>
      <GridRenderer />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        userData={{ type: "grid" }}
        ref={gridRef}
      >
        <planeGeometry args={[gridSize, gridSize]} />
        <meshToonMaterial attach="material" visible={false} />
      </mesh>
    </>
  );
}

export default Ground;
