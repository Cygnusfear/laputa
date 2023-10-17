import { IFacility } from "../types/entities";
import EntityData, { FacilityDataType } from "./entities";
import { ResourceType } from "./resources";

export type PlayerData = {
  resources: { [key in ResourceType]: number };
  facilities: IFacility[];
  name: string;
  tutorialIndex: number;
};

export const createNewPlayerData = (name = "New Player"): PlayerData => {
  return {
    resources: {
      LAPU: 1000,
      gravity: 0,
      population: 0,
      power: 0,
      water: 0,
      food: 0,
      crystal: 1,
    },
    facilities: [],
    name,
    tutorialIndex: 0,
  };
};

export type TutorialStep = {
  name: string;
  text: string;
  inventory: FacilityDataType[];
};

export const tutorialSteps = [
  {
    name: "intro",
    text: "Let's start by building a Gravity Hill",
    inventory: [EntityData.facilities.gravityhill],
  },
  {
    name: "power-up",
    text: "Power it all up",
    inventory: [
      EntityData.facilities.gravityhill,
      EntityData.facilities.dynamo,
    ],
  },
  {
    name: "living",
    text: "Make it a life worth living",
    inventory: [
      EntityData.facilities.gravityhill,
      EntityData.facilities.dynamo,
      EntityData.facilities.residence,
      EntityData.facilities.scaffold,
    ],
  },
] as TutorialStep[];

export const initializePlayer = () => {
  const player = window.localStorage.getItem("playerData");
  if (player) {
    return JSON.parse(player);
  } else {
    const newPlayer = createNewPlayerData();
    savePlayer(newPlayer);
    return newPlayer;
  }
};

export const savePlayer = (playerData: PlayerData) => {
  window.localStorage.setItem("playerData", JSON.stringify(playerData));
  console.log("Saved player data");
};
