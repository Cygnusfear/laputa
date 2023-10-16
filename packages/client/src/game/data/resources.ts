import { GiWaterDrop } from "react-icons/gi";
import { HiTicket } from "react-icons/hi";
import { HiBolt, HiWifi } from "react-icons/hi2";
import { IoFastFood } from "react-icons/io5";
import { FaGem, FaPersonRays } from "react-icons/fa6";
import { DoubleSide, MeshStandardMaterial } from "three";

export type ResourceType =
  | "LAPU"
  | "gravity"
  | "population"
  | "power"
  | "water"
  | "food"
  | "crystal";

const ResourceIcons: { [key in ResourceType]: typeof IoFastFood } = {
  power: HiBolt,
  gravity: HiWifi,
  water: GiWaterDrop,
  food: IoFastFood,
  LAPU: HiTicket,
  crystal: FaGem,
  population: FaPersonRays,
};

export const importTextures = [
  "/textures/box01.webp",
  "/textures/rockface.webp",
];

export const DefaultMaterials = {
  PlantsMat: new MeshStandardMaterial({
    roughness: 0.5,
    metalness: 0.6,
    side: DoubleSide,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.95,
  }),
  rockMat: new MeshStandardMaterial({
    roughness: 0.5,
    metalness: 0.6,
    side: DoubleSide,
    emissiveIntensity: 0.8,
    transparent: true,
    opacity: 0.95,
    color: "red",
  }),
} as const;

export { ResourceIcons };
