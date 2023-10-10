import { useEffect, useRef, useState } from "react";
import { Group, Vector3 } from "three";

import { palette } from "../utils/palette";

const HeightLine = () => {
  const lineRef = useRef<Group>(null!);
  const [points, setPoints] = useState<Vector3[]>([]);

  useEffect(() => {
    console.log("wut", lineRef);
    if (lineRef.current) {
      const p = lineRef.current
        .getWorldPosition(new Vector3(0, 0, 0))
        .negate()
        .setX(0)
        .setZ(0);
      const ps = [new Vector3(0, -1, 0), p];
      console.log(p, lineRef.current.getWorldPosition(new Vector3(0, -1, 0)));
      setPoints(ps);
    }
  }, [lineRef]);

  return (
    <group ref={lineRef}>
      {points.length > 0 && (
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              array={new Float32Array(points.flatMap((p) => p.toArray()))}
              count={points.length}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color={palette.cursor} />
        </line>
      )}
    </group>
  );
};

export default HeightLine;
