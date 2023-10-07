import { Environment } from "@react-three/drei";

function Background() {
  return (
    <group>
      <Environment preset="city" />
    </group>
  );
}

export default Background;
