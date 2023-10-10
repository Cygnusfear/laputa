import { RefObject, useMemo, useState } from "react";
import { useStore } from "../store";
import { AdditiveBlending, DoubleSide, Mesh, Vector3 } from "three";
import { animated, useSpring } from "@react-spring/three";
import { MouseInputEvent, useInput } from "../input/useInput";
import { buildFacility } from "../systems/constructionSystem";
import { palette } from "../utils/palette";
import { Directions, faceDirections } from "@/lib/utils";
import { IFacility } from "../types/entities";
import prand from "pure-rand";
import Wire from "./wire";
import { Html } from "@react-three/drei";
import { MdOutlineSignalWifi4Bar } from "react-icons/md";
import {
  PiWifiHighFill,
  PiWifiLowDuotone,
  PiWifiMediumDuotone,
  PiWifiNoneDuotone,
  PiXBold,
} from "react-icons/pi";
import { IconType } from "react-icons";
import { FacilitySound } from "../audio/facilitySound";

const Facility = (props: IFacility) => {
  const { position, entityRef } = props;
  const [faceIndex, setFaceIndex] = useState<number | undefined>(undefined);
  const {
    input: { cursor },
  } = useStore();

  const { onMouseMove } = useInput((event: MouseInputEvent) => {
    if (faceIndex === undefined) return;
    const direction = event.position.clone().add(faceDirections[faceIndex!]);
    cursor.setCursor({
      position: direction,
      direction: faceDirections[faceIndex!].clone().negate(),
    });
    event.event.stopPropagation();
  }, entityRef);

  const { onMouseDown, onMouseClick } = useInput((event) => {
    if (faceIndex === undefined) return;
    buildFacility(cursor.position);
    setFaceIndex(undefined);
    event.event.stopPropagation();
  }, entityRef);

  const { springScale } = useSpring({
    springScale: [1, 1, 1],
    from: { springScale: [1.2, 0.9, 1.2] },
    config: { mass: 1, tension: 1000, friction: 20, precision: 0.0001 },
  });

  return (
    <animated.group dispose={null}>
      <animated.mesh
        receiveShadow
        castShadow
        position={position}
        // @ts-ignore
        scale={springScale}
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
            visible={false}
            transparent={true}
            // TODO: Remove the face highlighting completely, or use alternative face highlighting like in Townscraper
            opacity={0}
            blending={AdditiveBlending}
            side={DoubleSide}
          />
        ))}
        <Renderer {...props} />
      </animated.mesh>
      <FacilitySound />
    </animated.group>
  );
};

const Renderer = (props: IFacility) => {
  const { colorPrimary, colorSecondary, variant, rotation, position } = props;
  const {
    assets: { meshes },
    world: { getEntityByPosition },
    input: { building },
  } = useStore();

  const prototypes = useMemo(
    () =>
      Object.values(meshes).filter(
        (mesh) => variant?.nodes.includes(mesh.name)
      ),
    [meshes, variant]
  );

  const rand = useMemo(() => {
    const seed = Date.now() ^ (Math.random() * 0x100000000);
    return prand.xoroshiro128plus(seed);
  }, []);

  const numWires = useMemo(() => {
    const entityBelow = getEntityByPosition(Directions.DOWN().add(position));
    if (entityBelow) return 0;
    return prand.unsafeUniformIntDistribution(0, 5, rand);
  }, [rand, position, getEntityByPosition]);

  if (!variant || !prototypes || prototypes.length < 1) {
    console.error("No prototypes found for variant", variant, prototypes);
    return null;
  }

  let IconWifi: IconType | null = null;
  switch (props.gravity) {
    case 4:
      IconWifi = MdOutlineSignalWifi4Bar;
      break;
    case 3:
      IconWifi = PiWifiMediumDuotone;
      break;
    case 2:
      IconWifi = PiWifiLowDuotone;
      break;
    case 1:
      IconWifi = PiWifiNoneDuotone;
      break;
    case 0:
      IconWifi = PiXBold;
      break;
    default:
      IconWifi = PiWifiHighFill;
  }

  return (
    <group
      layers={30}
      dispose={null}
      scale={new Vector3(1, 1, 1)}
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
      <Wire numWires={numWires} />
      {building && (
        <Html>
          <p className="gravity-ui flex flex-row items-center">
            {IconWifi && <IconWifi className="inline-flex text-white" />}
          </p>
        </Html>
      )}
    </group>
  );
};

export default Facility;
