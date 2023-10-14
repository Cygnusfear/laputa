import { GiOrbitalRays, GiWaterDrop, GiFloatingCrystal } from "react-icons/gi";
import { HiTicket } from "react-icons/hi";
import { HiBolt } from "react-icons/hi2";
import { IoFastFood } from "react-icons/io5";
import { FaPersonRays } from "react-icons/fa6";
import { DoubleSide, MeshStandardMaterial } from "three";

export type ResourceType =
  | "power"
  | "gravity"
  | "water"
  | "food"
  | "lapu"
  | "crystal"
  | "population";

const ResourceIcons: { [key in ResourceType]: typeof IoFastFood } = {
  power: HiBolt,
  gravity: GiOrbitalRays,
  water: GiWaterDrop,
  food: IoFastFood,
  lapu: HiTicket,
  crystal: GiFloatingCrystal,
  population: FaPersonRays,
};

export const DefaultMaterials = {
  PlantsMat: new MeshStandardMaterial({
    roughness: 0.5,
    metalness: 0.6,
    side: DoubleSide,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.95,
  }),
} as const;

export { ResourceIcons };
