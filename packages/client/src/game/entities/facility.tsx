import { RefObject, useState } from "react";
import { useStore } from "../store";
import { AdditiveBlending, DoubleSide, Mesh, Vector3 } from "three";
import { animated } from "@react-spring/three";
import { MouseInputEvent, useInput } from "../input/useInput";
import {
  buildFacility,
  canBuildAtPosition,
} from "../systems/constructionSystem";
import { palette } from "../utils/palette";
import { faceDirections } from "@/lib/utils";
import { IFacility } from "../types/entities";

const Renderer = (props: IFacility) => {
  const { colorPrimary, colorSecondary, scale, variant, rotation } = props;
  const {
    assets: { meshes },
  } = useStore();

  const [prototypes] = useState(
    Object.values(meshes).filter((node) => variant?.nodes.includes(node.name))
  );

  if (!variant || !prototypes || prototypes.length < 1) {
    console.error("No prototypes found for variant", variant, prototypes);
    return null;
  }

  return (
    <group
      dispose={null}
      scale={scale.multiplyScalar(0.7)}
      position={[0, 0, 0]}
      rotation={[0, rotation.y, 0]}
    >
      {prototypes!.map((proto, index) => {
        let color = variant.colors[index];
        switch (variant.colors[index]) {
          case "primary":
            color = colorPrimary!;
            break;
          case "secondary":
            color = colorSecondary!;
            break;
        }
        return (
          <mesh
            dispose={null}
            position={[0, 0, 0]}
            key={index}
            geometry={proto.geometry.clone()}
            receiveShadow
            castShadow
          >
            {
              // @ts-ignore
              proto.material?.map ? (
                <meshLambertMaterial
                  attach="material"
                  // @ts-ignore
                  map={proto.material?.map}
                />
              ) : (
                <meshLambertMaterial attach={`material`} color={color} />
              )
            }
          </mesh>
        );
      })}
    </group>
  );
};

const Facility = (props: IFacility) => {
  const { position, scale, entityRef } = props;
  const [faceIndex, setFaceIndex] = useState<number | undefined>(undefined);
  const {
    input: { cursor },
  } = useStore();

  const { onMouseMove } = useInput((event: MouseInputEvent) => {
    if (faceIndex === undefined) return;
    const direction = event.position.clone().add(faceDirections[faceIndex!]);
    const canBuild = canBuildAtPosition(direction);
    if (canBuild) {
      cursor.setCursor({
        position: direction,
        cursorState: "valid",
        direction: faceDirections[faceIndex!].clone().negate(),
      });
    } else {
      cursor.setCursor({ cursorState: "hidden" });
    }
  }, entityRef);

  const { onMouseDown, onMouseClick } = useInput((event: MouseInputEvent) => {
    if (faceIndex === undefined) return;
    const direction = event.position.clone().add(faceDirections[faceIndex!]);
    const canBuild = canBuildAtPosition(direction);
    if (canBuild) {
      buildFacility(direction);
      setFaceIndex(undefined);
    }
  }, entityRef);

  return (
    <group dispose={null}>
      <animated.mesh
        receiveShadow
        castShadow
        position={position}
        scale={scale}
        ref={entityRef as RefObject<Mesh>}
        userData={{ type: "facility", name: props.type.name }}
        onPointerDown={onMouseDown}
        onPointerUp={onMouseClick}
        onPointerMove={(e) => {
          // make sure we match the correct object
          if (e.object === e.eventObject) {
            setFaceIndex(
              e?.face?.materialIndex !== undefined
                ? e.face.materialIndex
                : undefined
            );
            onMouseMove(e);
            e.stopPropagation();
          }
        }}
        onPointerLeave={() => setFaceIndex(undefined)}
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
              faceIndex !== undefined && faceIndex === index
                ? palette.cursor
                : "black"
            }
            visible={faceIndex !== undefined && faceIndex === index}
            transparent={true}
            // TODO: Remove the face highlighting completely, or use alternative face highlighting like in Townscraper
            opacity={0}
            blending={AdditiveBlending}
            side={DoubleSide}
          />
        ))}
        <Renderer {...props} />
      </animated.mesh>
    </group>
  );
};

export default Facility;
