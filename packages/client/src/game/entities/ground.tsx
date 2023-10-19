import { createRef } from "react";
import { Grid, GridProps } from "@react-three/drei";

import { useInput } from "../input/useInput";
import { getState, useStore } from "../store";
import { Directions } from "@/lib/utils";
import useConstruction from "../systems/useConstruction";

const gridSize = 1000;

function GridRenderer() {
  const {
    input: { building },
  } = useStore();
  const gridConfig = {
    cellSize: 1,
    cellThickness: 0.9,
    sectionSize: 5,
    fadeDistance: 40,
    fadeStrength: 2,
    followCamera: true,
    infiniteGrid: true,
  } as GridProps;
  return (
    <>
      <Grid
        position={[0.5, -0.5, 50.5]}
        args={[30.5, 30.5]}
        {...gridConfig}
        cellColor={"#76EAE4"}
        sectionColor={building ? "#76EAE4" : "#777777"}
        sectionThickness={building ? 1 : 0}
      />
      <Grid
        position={[0.5, -0.5, 50.5]}
        rotation={[-Math.PI, 0, 0]}
        args={[30.5, 30.5]}
        {...gridConfig}
        cellColor={building ? "#76EAE4" : "#777777"}
        sectionColor={building ? "#76EAE4" : "#777777"}
        sectionThickness={building ? 1 : 0}
      />
    </>
  );
}

function Ground() {
  const gridRef = createRef<THREE.Mesh>();
  const { constructFacility } = useConstruction();
  const {
    input: { cursor },
  } = getState();

  const { onMouseMove } = useInput((event) => {
    if (event.event.object === event.event.eventObject) {
      cursor.setCursor({
        position: event.position,
        direction: Directions.DOWN(),
      });
    }
  }, gridRef);

  const { onMouseDown, onMouseClick } = useInput((event) => {
    constructFacility(event.position);
  }, gridRef);

  return (
    <>
      <GridRenderer />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        userData={{ type: "grid" }}
        ref={gridRef}
        onPointerDown={onMouseDown}
        onClick={onMouseClick}
        onPointerMove={onMouseMove}
        onPointerEnter={onMouseMove}
      >
        <planeGeometry args={[gridSize, gridSize]} />
        <meshToonMaterial attach="material" visible={false} />
      </mesh>
    </>
  );
}

export default Ground;
