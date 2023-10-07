import { RefObject } from "react";
import { Facility } from "../store";
import { Mesh } from "three";

const Facility = (props: Facility) => {
  const { position, scale, rotation, ref: facilityRef } = props;
  // const [hovered, setHover] = useState<number | undefined>(undefined);

  return (
    <group>
      <mesh
        position={position.toArray()}
        scale={scale.toArray()}
        rotation={rotation.toArray()}
        ref={facilityRef as RefObject<Mesh>}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh>
    </group>
  );
};

export default Facility;
