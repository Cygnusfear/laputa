import { IFacility } from "../types/entities";
import { ResourceType } from "./resources";

export type PlayerData = {
  resources: { [key in ResourceType]: number };
  facilities: IFacility[];
  name: string;
  tutorialIndex: number;
  address: string;
};

export const createNewPlayerData = ({
  name,
  address,
}: {
  name?: string;
  address?: string;
}): PlayerData => {
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
    name: name || "New Player",
    tutorialIndex: 0,
    address: address || "",
  };
};

export const initializePlayer = ({
  address,
}: {
  address?: string;
}): PlayerData => {
  const player = window.localStorage.getItem("playerData");
  if (player) {
    const playerData = JSON.parse(player) as PlayerData;
    playerData.address = address || playerData.address;
    console.log("Loaded player data", playerData);
    Object.assign(window, { player: playerData });
    return playerData;
  } else {
    const newPlayer = createNewPlayerData({ address });
    savePlayer(newPlayer);
    console.log("Created new player data", newPlayer);
    Object.assign(window, { player: newPlayer });
    return newPlayer;
  }
};

export const savePlayer = async (playerData: PlayerData) => {
  const cleanData = JSON.parse(JSON.stringify(playerData)) as PlayerData;
  cleanData.facilities = [];
  // window.localStorage.setItem("playerData", JSON.stringify(cleanData));
};

export const hasFacility = (playerData: PlayerData, facilityId: number) => {
  return playerData.facilities.some((f) => f.type.entityTypeId === facilityId);
};
