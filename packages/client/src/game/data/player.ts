import { IFacility } from "../types/entities";
import { ResourceType } from "./resources";

export type PlayerData = {
  resources: { [key in ResourceType]: number };
  facilities: IFacility[];
  name: string;
};

export const createNewPlayerData = (name = "New Player"): PlayerData => {
  return {
    resources: {
      power: 0,
      gravity: 0,
      water: 0,
      food: 0,
      LAPU: 1000,
      crystal: 0,
      population: 0,
    },
    facilities: [],
    name,
  };
};
