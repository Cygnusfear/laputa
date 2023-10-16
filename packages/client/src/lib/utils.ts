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

/**
 * Object representing directional constants.
 */
export const Directions = {
  /**
   * Get the right direction.
   * @returns {Vector3} The right direction (1, 0, 0).
   */
  RIGHT: (): Vector3 => new Vector3(1, 0, 0),

  /**
   * Get the left direction.
   * @returns {Vector3} The left direction (-1, 0, 0).
   */
  LEFT: (): Vector3 => new Vector3(-1, 0, 0),

  /**
   * Get the up direction.
   * @returns {Vector3} The up direction (0, 1, 0).
   */
  UP: (): Vector3 => new Vector3(0, 1, 0),

  /**
   * Get the down direction.
   * @returns {Vector3} The down direction (0, -1, 0).
   */
  DOWN: (): Vector3 => new Vector3(0, -1, 0),

  /**
   * Get the forward direction.
   * @returns {Vector3} The forward direction (0, 0, 1).
   */
  FORWARD: (): Vector3 => new Vector3(0, 0, 1),

  /**
   * Get the backward direction.
   * @returns {Vector3} The backward direction (0, 0, -1).
   */
  BACKWARD: (): Vector3 => new Vector3(0, 0, -1),
};

/**
 * Array of face directions.
 */
export const faceDirections: Vector3[] = [
  Directions.RIGHT(),
  Directions.LEFT(),
  Directions.UP(),
  Directions.DOWN(),
  Directions.FORWARD(),
  Directions.BACKWARD(),
];

export const degreesToRadians = (degrees: number) => {
  return degrees * (Math.PI / 180);
};
