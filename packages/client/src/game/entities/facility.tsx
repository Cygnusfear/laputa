import { RefObject, useState } from "react";
import { Facility, useStore } from "../store";
import { AdditiveBlending, DoubleSide, Mesh, Vector3 } from "three";
import { animated } from "@react-spring/three";
import { MouseInputEvent, useInput } from "../input/useInput";
import { buildFacility } from "../systems/constructionSystem";
import { palette } from "../utils/palette";

const faceDirections = [
  new Vector3(1, 0, 0),
  new Vector3(-1, 0, 0),
  new Vector3(0, 1, 0),
  new Vector3(0, -1, 0),
  new Vector3(0, 0, 1),
  new Vector3(0, 0, -1),
];

const Facility = (props: Facility) => {
  const { position, scale, colorPrimary, entityRef } = props;
  const [hovered, setHover] = useState<number | undefined>(undefined);
  const {
    world: { getEntityByPosition },
    input: { cursor },
  } = useStore();

  const { onMouseMove } = useInput((event: MouseInputEvent) => {
    if (hovered === undefined) return;
    const direction = event.position.clone().add(faceDirections[hovered!]);
    const existingFacility = getEntityByPosition(direction);
    // console.log(hovered, event, direction, existingFacility);
    if (!existingFacility) {
      cursor.setCursor({ position: direction, cursorState: "valid" });
    } else {
      cursor.setCursor({ cursorState: "hidden" });
    }
  }, entityRef);

  const { onMouseDown, onMouseClick } = useInput((event: MouseInputEvent) => {
    if (hovered === undefined) return;
    const direction = event.position.clone().add(faceDirections[hovered!]);
    const existingFacility = getEntityByPosition(direction);
    if (!existingFacility) {
      buildFacility(direction);
      setHover(undefined);
    }
  });

  return (
    <group dispose={null}>
      <animated.mesh
        receiveShadow
        castShadow
        position={position}
        scale={scale}
        ref={entityRef as RefObject<Mesh>}
        userData={{ type: "facility" }}
        onPointerDown={onMouseDown}
        onPointerUp={onMouseClick}
        onPointerMove={(e) => {
          setHover(
            e?.face?.materialIndex !== undefined
              ? e.face.materialIndex
              : undefined
          );
          onMouseMove(e);
          e.stopPropagation();
        }}
        onPointerLeave={() => setHover(undefined)}
      >
        <boxGeometry
          attach="geometry"
          args={new Vector3(1, 1, 1).multiplyScalar(1).toArray()}
        />
        {[...Array(6)].map((_, index) => (
          <meshLambertMaterial
            attach={`material-${index}`}
            key={index}
            color={
              hovered !== undefined && hovered === index
                ? palette.cursor
                : "black"
            }
            visible={hovered !== undefined && hovered === index}
            transparent={true}
            opacity={0.2}
            blending={AdditiveBlending}
            side={DoubleSide}
          />
        ))}
        <mesh>
          <boxGeometry args={[1, 1, 1]} />

          <meshStandardMaterial color={colorPrimary} />
        </mesh>
      </animated.mesh>
    </group>
  );
};

export default Facility;
