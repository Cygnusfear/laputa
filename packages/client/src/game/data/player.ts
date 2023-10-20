import { IFacility } from "../types/entities";
import { ResourceType } from "./resources";
import { setItem } from "window-async-local-storage";

export type PlayerData = {
  resources: { [key in ResourceType]: number };
  facilities: IFacility[];
  name: string;
  activeTutorials: string[];
  finishedTutorials: string[];
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
    activeTutorials: [],
    finishedTutorials: [],
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

export const savePlayer = async (playerData: PlayerData, verbose = false) => {
  const cleanPlayer: PlayerData = {
    resources: { ...playerData.resources },
    activeTutorials: [...playerData.activeTutorials],
    finishedTutorials: [...playerData.finishedTutorials],
    address: playerData.address,
    name: playerData.name,
    facilities: [],
  };
  setItem("playerData", JSON.stringify(cleanPlayer)).then(() => {
    if (verbose) console.log("saved", cleanPlayer);
  });
};

export const hasFacility = (playerData: PlayerData, facilityId: number) => {
  return !!playerData.facilities.find(
    (f) => f.type.entityTypeId === facilityId
  );
};
