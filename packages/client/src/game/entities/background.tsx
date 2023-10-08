import { Clouds, Cloud, Environment } from "@react-three/drei";
import { MeshStandardMaterial } from "three";

function Background() {
  return (
    <group>
      <Environment preset="forest" />
      <Clouds material={MeshStandardMaterial}>
        <Cloud
          bounds={[200, 10, 200]}
          volume={200}
          color="#C59885"
          seed={12}
          position={[0, -2, 0]}
          fade={120}
          opacity={0.09}
        />
        <Cloud
          bounds={[100, 2, 100]}
          seed={100}
          scale={1}
          volume={50}
          color="#C59885"
          fade={120}
          position={[0, -5, 0]}
          opacity={0.23}
          speed={0.02}
          concentrate={"inside"}
        />
      </Clouds>
    </group>
  );
}

export default Background;
