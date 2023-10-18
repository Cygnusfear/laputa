import { DoubleSide, Vector3 } from "three";
import { useSpring, a } from "@react-spring/three";
import { Billboard } from "@react-three/drei";

// GeneratedResource Component
type CoinProps = {
  id: string;
  position: Vector3;
  onComplete?: (id: string) => void;
};

const GeneratedResource: React.FC<CoinProps> = ({
  id,
  position,
  onComplete,
}) => {
  const [props] = useSpring(() => ({
    from: {
      position: [position.x, position.y + 0.5, position.z],
      rotation: [0, 0, 0],
      scale: [0, 0, 0],
      opacity: 1,
      config: { duration: 1000 },
    },
    to: {
      position: [position.x, position.y + 2, position.z],
      rotation: [0, Math.PI * 2, 0],
      scale: [1, 1, 1],
      opacity: 0,
    },
    loop: false,
    onRest: () => {
      setTimeout(() => {
        onComplete!(id); // Pass UUID to onComplete
      }, 100);
    },
  }));

  return (
    <a.group
      position={props.position}
      rotation={props.rotation}
      scale={props.scale}
    >
      <Billboard>
        <mesh>
          <circleGeometry args={[0.25, 32]} />
          <meshBasicMaterial color="yellow" side={DoubleSide} />
        </mesh>
      </Billboard>
    </a.group>
  );
};

export default GeneratedResource;
