import React, { useMemo } from "react";
import { Vector3, QuadraticBezierCurve3 } from "three";
import prand from "pure-rand";
import { Directions, getRandom } from "@/lib/utils";
import { palette } from "../utils/palette";

interface WireProps {
  numWires?: number;
}

const Wire: React.FC<WireProps> = ({ numWires = 5 }) => {
  const colors = useMemo(() => {
    let c: string[] = [];
    for (let i = 0; i < numWires; i++) {
      c = [...c, getRandom(palette.wireColors)];
    }
    return c;
  }, [numWires]);
  const wires = useMemo(() => {
    const seed = Date.now() ^ (Math.random() * 0x100000000);
    const rand = prand.unsafeUniformIntDistribution;
    const rng = prand.xoroshiro128plus(seed);
    const wiresArray: Vector3[][] = [];

    for (let i = 0; i < numWires; i++) {
      // Random start and end X and Z coordinates within the tile
      const startX = 0.75 * (rand(0, 100, rng) / 100 - 0.5);
      const endX = 0.75 * (rand(0, 100, rng) / 100 - 0.5);
      const startZ = 0.75 * (rand(0, 100, rng) / 100 - 0.5);
      const endZ = 0.75 * (rand(0, 100, rng) / 100 - 0.5);

      // Fixed Y coordinate to 1 (top of the tile)
      const startY = 1;
      const endY = 1;

      // Random droop amount between -0.5 and -1
      const controlPointY = -1 * (rand(0, 100, rng) / 100);

      // Random X, Z for control point
      const controlPointX = (startX + endX) / 2;
      const controlPointZ = (startZ + endZ) / 2;

      const startPoint = new Vector3(startX, startY, startZ).add(
        Directions.DOWN()
      );
      const endPoint = new Vector3(endX, endY, endZ).add(Directions.DOWN());
      const controlPoint = new Vector3(
        controlPointX,
        controlPointY,
        controlPointZ
      ).add(Directions.DOWN());

      // Create a quadratic bezier curve and get points along the curve
      const curve = new QuadraticBezierCurve3(
        startPoint,
        controlPoint,
        endPoint
      );
      const points = curve.getPoints(50); // 50 points along the curve

      wiresArray.push(points);
    }
    return wiresArray;
  }, [numWires]);

  return (
    <>
      {wires.map((points, idx) => (
        <line key={idx}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(points.flatMap((p) => p.toArray()))}
              count={points.length}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial
            attach="material"
            color={colors[idx]}
            transparent
            opacity={0.8}
          />
        </line>
      ))}
    </>
  );
};

export default Wire;
