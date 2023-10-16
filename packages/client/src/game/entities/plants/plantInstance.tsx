import { IFacility } from "@/game/types/entities";
import { palette } from "@/game/utils/palette";
import { getRandom } from "@/lib/utils";
import { Instance } from "@react-three/drei";
import { useMemo, useState } from "react";
import { Vector3 } from "three";
import prand from "pure-rand";

export type PlantProps = {
  positions: [number, number, number][];
  scales: number[];
  rotations: [number, number, number][];
  grassColors: string[];
};

const rand = prand.unsafeUniformIntDistribution;

// Helper functions for veggie instance props
const CreatePosition = (position: Vector3, rng: prand.RandomGenerator) =>
  [
    ((rand(0, 1000, rng) / 1000) * 2 - 1) * 0.3 + position.x,
    0.4 + position.y,
    ((rand(0, 1000, rng) / 1000) * 2 - 1) * 0.3 + position.z,
  ] as [number, number, number];

const CreateRotation = (rng: prand.RandomGenerator) =>
  [0, (rand(0, 1000, rng) / 1000) * 360, 0] as [number, number, number];

const CreateScale = (rng: prand.RandomGenerator) =>
  0.05 + (rand(0, 1000, rng) / 1000) * 0.2;

export function PlantInstance(props: IFacility) {
  const { position, seed } = props;
  const [amount, setAmount] = useState(0);
  const [properties, setProperties] = useState<PlantProps>({
    positions: [],
    scales: [],
    rotations: [],
    grassColors: [],
  });
  const [rng] = useState(prand.xoroshiro128plus(seed));
  const limit = 4;
  const vegetationTier = useMemo(() => {
    return prand.unsafeUniformIntDistribution(0, limit, rng);
  }, [rng]);

  const plantProps = useMemo(() => {
    setAmount(Math.min(vegetationTier, limit));
    if (properties.positions.length >= amount) {
      return properties;
    }
    const { positions, scales, rotations, grassColors } = properties;

    const p = {
      positions: [...positions, CreatePosition(position, rng)],
      scales: [...scales, CreateScale(rng)],
      rotations: [...rotations, CreateRotation(rng)],
      grassColors: [...grassColors, getRandom(palette.grassColors)],
    };
    setProperties(p);
    return { ...properties };
  }, [vegetationTier, properties, amount, position, rng]);

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
            frustumCulled={false}
          />
        );
      })}
    </>
  );
}
