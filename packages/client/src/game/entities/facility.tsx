import { RefObject, useMemo } from "react";
import { getState, useStore } from "../store";
import { Mesh } from "three";
import { animated, useSpring } from "@react-spring/three";
import { MouseInputEvent, useInput } from "../input/useInput";
import { Directions, faceDirections } from "@/lib/utils";
import { IFacility } from "../types/entities";
import prand from "pure-rand";
import Wires from "./wires";
// import { Html } from "@react-three/drei";
// import { MdWifi } from "react-icons/md";
// import {
//   PiWifiLowDuotone,
//   PiWifiMediumDuotone,
//   PiWifiNoneDuotone,
//   PiXBold,
// } from "react-icons/pi";
import { FacilitySound } from "../audio/facilitySound";
import useConstruction from "../systems/useConstruction";
import { Outlines } from "@react-three/drei";

const Facility = (props: IFacility) => {
  const { position, entityRef } = props;
  const { constructFacility } = useConstruction();

  const { onMouseMove } = useInput((event: MouseInputEvent) => {
    if (event.event.faceIndex === undefined) return;
    const idx = Math.floor(event.event.faceIndex / 2);
    const direction = event.position.clone().add(faceDirections[idx!]);
    getState().input.cursor.setCursor({
      position: direction,
      direction: faceDirections[idx!].clone().negate(),
    });
    event.event.stopPropagation();
  }, entityRef);

  const { onMouseDown, onMouseClick } = useInput((event) => {
    constructFacility(getState().input.cursor.position);
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
          if (e.object === e.eventObject && e.faceIndex !== undefined) {
            onMouseMove(e);
            e.stopPropagation();
          }
        }}
      >
        <boxGeometry attach="geometry" args={[1, 1, 1]} />
        <meshBasicMaterial attach="material" visible={false} />
        <FacilityRenderer {...props} />
      </animated.mesh>
      <FacilitySound />
    </animated.group>
  );
};

const FacilityRenderer = (props: IFacility) => {
  const { colorPrimary, colorSecondary, variant, position, type, rotation } =
    props;
  const { building } = useStore().input;

  const prototypes = useMemo(
    () =>
      Object.values(getState().assets.meshes).filter(
        (mesh) => variant?.nodes.includes(mesh.name)
      ),
    [variant]
  );

  const rand = useMemo(() => {
    const seed = Date.now() ^ (Math.random() * 0x100000000);
    return prand.xoroshiro128plus(seed);
  }, []);

  const numWires = useMemo(() => {
    const getEntityByPosition = getState().world.getEntityByPosition;
    const entityBelow = getEntityByPosition(Directions.DOWN().add(position));
    if (entityBelow) return 0;
    return prand.unsafeUniformIntDistribution(0, 5, rand);
  }, [rand, position]);

  const buildingMode = useMemo(() => {
    return building && props.owner === getState().player.playerData?.address;
  }, [building, props.owner]);

  // const IconWifi = useMemo(() => {
  //   switch (props.gravity) {
  //     case 4:
  //       return MdWifi;
  //       break;
  //     case 3:
  //       return PiWifiMediumDuotone;
  //       break;
  //     case 2:
  //       return PiWifiLowDuotone;
  //       break;
  //     case 1:
  //       return PiWifiNoneDuotone;
  //       break;
  //     case 0:
  //       return PiXBold;
  //       break;
  //     default:
  //       return MdWifi;
  //   }
  // }, [props.gravity]);

  if (!variant || !prototypes || prototypes.length < 1) {
    console.error("No prototypes found for variant", variant, prototypes);
    return null;
  }

  return (
    <group
      layers={30}
      dispose={null}
      scale={[1, 1, 1]}
      position={[0, 0, 0]}
      rotation={rotation.toArray()}
    >
      {prototypes!.map((proto, index) => {
        const variantIndex = variant.nodes.indexOf(proto.name);
        let color = variant.colors[variantIndex];
        switch (variant.colors[variantIndex]) {
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
            geometry={proto.geometry}
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
            {buildingMode && <Outlines thickness={0.03} color="#76EAE4" />}
          </mesh>
        );
      })}
      {type.tags.includes("hasWires") && <Wires numWires={numWires} />}
      {/* {building && (
        <Html>
          <p className="gravity-ui flex flex-row items-center">
            {IconWifi && <IconWifi className="inline-flex text-white" />}
          </p>
        </Html>
      )} */}
    </group>
  );
};

export default Facility;
