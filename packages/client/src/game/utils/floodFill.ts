import { Vector3 } from "three";
import { IEntity } from "../types/entities";
import { Directions } from "@/lib/utils";
import { getState } from "../store";

export function floodFill(
  startPosition: Vector3,
  // propertyName: keyof IEntity,
  initialValue: number
) {
  const { getEntityByPosition } = getState().world;

  const processedEntities = new Set<IEntity>();

  function recursiveFill(position: Vector3, value: number) {
    const entity = getEntityByPosition(position);
    if (entity && !processedEntities.has(entity) && value > 0) {
      processedEntities.add(entity);
      entity.gravity += value;
      const neighbors = [
        position.clone().add(Directions.RIGHT()),
        position.clone().add(Directions.LEFT()),
        position.clone().add(Directions.UP()),
        position.clone().add(Directions.DOWN()),
        position.clone().add(Directions.FORWARD()),
        position.clone().add(Directions.BACKWARD()),
      ];
      const v = value - 1;
      neighbors.forEach((neighborPosition) => {
        recursiveFill(neighborPosition, v);
      });
    }
  }

  recursiveFill(startPosition, initialValue);
}
