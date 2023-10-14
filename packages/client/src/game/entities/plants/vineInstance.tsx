import { useStore } from "@/game/store";
import { IFacility } from "@/game/types/entities";
import { palette } from "@/game/utils/palette";
import { Directions, getRandom } from "@/lib/utils";
import { Instance } from "@react-three/drei";
import { useMemo, useState } from "react";
import { Vector3, Vector3Tuple } from "three";

const limit = 30;

const CreatePositions = (
  startPos: Vector3,
  interval: number,
  scale: Vector3Tuple
) => {
  const pos: Vector3[] = [];
  const x = 1,
    edge = Math.random() < 0.5 ? -0.5 : 0.5;
  const [randX, randZ] = [0, 2].map(
    (i) => scale[i] * x * (Math.random() < 0.5 ? edge : Math.random() - 0.5)
  );
  const newX = startPos.x + randX;
  const newZ = startPos.z + randZ;
  const randY = -1 * (Math.random() * 7 + 3);
  const dirToRandPoint = new Vector3(newX, startPos.y, newZ)
    .sub(startPos)
    .normalize();

  [
    ...Array(
      Math.floor(
        startPos.distanceTo(new Vector3(newX, startPos.y, newZ)) / interval
      ) + 1
    ).keys(),
  ].forEach((i) =>
    pos.push(
      startPos.clone().add(dirToRandPoint.clone().multiplyScalar(i * interval))
    )
  );

  [...Array(Math.floor(Math.abs(randY) / interval)).keys()].forEach(() =>
    pos.push(pos[pos.length - 1].clone().add(new Vector3(0, -interval, 0)))
  );

  return pos.map((p) => p.toArray());
};

export function VineInstance(facilityProps: IFacility) {
  const {
    world: { getEntityByPosition },
  } = useStore();
  const { position, scale } = facilityProps;
  const [render] = useState(
    Math.random() > 0.6 &&
      getEntityByPosition(Directions.DOWN().add(position)) !== undefined
  );
  const [amt] = useState(limit);

  const props = useMemo(() => {
    const pos = CreatePositions(
      new Vector3(0, 0.55, 0).add(position),
      0.075,
      scale?.toArray() || [1, 1, 1]
    );
    //
    return {
      positions: pos,
      scales: new Vector3(...pos.map(() => Math.random() * 0.04 + 0.02)),
      rotations: pos.map(() =>
        new Vector3(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ).toArray()
      ),
      grassColors: pos.map(() => getRandom(palette.grassColors)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!render) return null;
  return (
    <>
      {props.positions.map((p, i) => {
        if (i > limit) return null;
        return (
          <Instance
            key={i}
            color={props.grassColors[i]}
            position={p}
            scale={props.scales}
            rotation={props.rotations[i]}
            visible={i < amt}
          />
        );
      })}
    </>
  );
}
