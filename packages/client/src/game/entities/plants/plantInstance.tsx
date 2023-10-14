import { IFacility } from "@/game/types/entities";
import { palette } from "@/game/utils/palette";
import { getRandom } from "@/lib/utils";
import { Instance } from "@react-three/drei";
import { useMemo, useState } from "react";
import { Vector3 } from "three";

export type PlantProps = {
  positions: [number, number, number][];
  scales: number[];
  rotations: [number, number, number][];
  grassColors: string[];
};

// Helper functions for veggie instance props
const CreatePosition = (position: Vector3) =>
  [
    (Math.random() * 2 - 1) * 0.3 + position.x,
    0.4 + position.y,
    (Math.random() * 2 - 1) * 0.3 + position.z,
  ] as [number, number, number];

const CreateRotation = () =>
  [0, Math.random() * 360, 0] as [number, number, number];

const CreateScale = () => 0.05 + Math.random() * 0.2;

export function PlantInstance(props: IFacility) {
  const { position } = props;
  const [amount, setAmount] = useState(0);
  const [properties, setProperties] = useState<PlantProps>({
    positions: [],
    scales: [],
    rotations: [],
    grassColors: [],
  });
  const vegetationTier = 4;
  const limit = 4;

  const plantProps = useMemo(() => {
    setAmount(Math.min(vegetationTier, limit));
    // if (vegetationTier >= limit) {
    //   if (vine === undefined) {
    //     // 🌿 spawn vine?
    //     if (Math.random() > 0.6) {
    //       console.log("🌿 spawn vine");
    //       setVine(
    //         properties.positions[
    //           Math.floor(Math.random() * properties.positions.length - 1)
    //         ]
    //       );
    //     } else {
    //       setVine(null);
    //     }
    //   }
    // }
    if (properties.positions.length >= amount) {
      return properties;
    }
    const { positions, scales, rotations, grassColors } = properties;

    const p = {
      positions: [...positions, CreatePosition(position)],
      scales: [...scales, CreateScale()],
      rotations: [...rotations, CreateRotation()],
      grassColors: [...grassColors, getRandom(palette.grassColors)],
    };
    setProperties(p);
    return { ...properties };
  }, [properties, amount, position]);

  return (
    <>
      {/* // 🌱 */}
      {plantProps?.positions.map((position, index) => {
        if (index >= limit) return;
        const { scales, rotations, grassColors } = plantProps!;
        return (
          <Instance
            key={index}
            color={grassColors[index]}
            position={position}
            scale={[scales[index], scales[index], scales[index]]}
            rotation={rotations[index]}
          />
        );
      })}
    </>
  );
}
