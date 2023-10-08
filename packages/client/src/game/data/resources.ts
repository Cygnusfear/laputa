import { GiOrbitalRays, GiWaterDrop } from "react-icons/gi";
import { HiTicket } from "react-icons/hi";
import { HiBolt } from "react-icons/hi2";
import { IoFastFood } from "react-icons/io5";
import { FaPersonRays } from "react-icons/fa6";

export type ResourceType =
  | "power"
  | "gravity"
  | "water"
  | "food"
  | "lapu"
  | "population";

const ResourceIcons: { [key in ResourceType]: typeof IoFastFood } = {
  power: HiBolt,
  gravity: GiOrbitalRays,
  water: GiWaterDrop,
  food: IoFastFood,
  lapu: HiTicket,
  population: FaPersonRays,
};

export { ResourceIcons };
