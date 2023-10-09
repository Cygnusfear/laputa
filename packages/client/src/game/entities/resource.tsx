import { IResource } from "../types/entities";
import { useState } from "react";
import { useStore } from "../store";
// import { Sparkles } from "@react-three/drei";

function Resource(props: IResource) {
  const { position } = props;
  return (
    <mesh position={position}>
      {/* <boxGeometry args={[1, 1]} /> */}
      {/* <meshLambertMaterial color="hotpink" /> */}
      <Renderer {...props} />
    </mesh>
  );
}

const Renderer = (props: IResource) => {
  const { variant, scale } = props;
  const {
    assets: { meshes },
  } = useStore();

  const [prototypes] = useState(
    Object.values(meshes).filter((mesh) => variant?.nodes.includes(mesh.name))
  );

  if (!variant || !prototypes || prototypes.length < 1) {
    console.error("No prototypes found for variant", variant, prototypes);
    return null;
  }

  return (
    <group layers={30} dispose={null} scale={scale} position={[0, 0, 0]}>
      {prototypes!.map((proto, index) => {
        return (
          <mesh
            dispose={null}
            position={[0, 0, 0]}
            key={index}
            geometry={proto.geometry.clone()}
            receiveShadow
            castShadow
            rotation={[Math.PI / 2, 0, 0]}
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
                <meshLambertMaterial attach={`material`} />
              )
            }
          </mesh>
        );
      })}
      {/* <Sparkles count={12} scale={5} size={5} color={"#FF6188"} /> */}
    </group>
  );
};

export default Resource;
