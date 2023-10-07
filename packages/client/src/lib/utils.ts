import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Vector3 } from "three";

/**
 * Merges the given class names with the tailwind classes
 * @param inputs The class names to merge
 * @returns The merged class names
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export function getRandom<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export const Directions = {
  RIGHT: () => new Vector3(1, 0, 0),
  LEFT: () => new Vector3(-1, 0, 0),
  UP: () => new Vector3(0, 1, 0),
  DOWN: () => new Vector3(0, -1, 0),
  FORWARD: () => new Vector3(0, 0, 1),
  BACKWARD: () => new Vector3(0, 0, -1),
};

export const faceDirections = [
  Directions.RIGHT(),
  Directions.LEFT(),
  Directions.UP(), //up
  Directions.DOWN(),
  Directions.FORWARD(),
  Directions.BACKWARD(),
];
