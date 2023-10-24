import { getMUD } from "@/mud/setup";
import { IFacility } from "../types/entities";
import { ResourceType } from "./resources";
import { setItem } from "window-async-local-storage";
import { getState } from "../store";
import { queueAsyncCall } from "../utils/asyncQueue";

export type PlayerData = {
  LAPUtoBeConsolidated: number;
  resources: { [key in ResourceType]: number };
  facilities: IFacility[];
  name: string;
  activeTutorials: string[];
  finishedTutorials: string[];
  address: string;
  hasComethWallet: string;
};

export const createNewPlayerData = ({
  name,
  address,
}: {
  name?: string;
  address?: string;
}): PlayerData => {
  return {
    LAPUtoBeConsolidated: 0,
    resources: {
      LAPU: 0,
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
    hasComethWallet: window.localStorage.getItem("comethWalletAddress") || "",
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
    console.trace("Loaded player data", playerData);
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
  const cleanPlayer: Partial<PlayerData> = {
    resources: { ...playerData.resources },
    activeTutorials: [...playerData.activeTutorials],
    finishedTutorials: [...playerData.finishedTutorials],
    address: playerData.address,
    name: playerData.name,
    facilities: [],
    hasComethWallet: window.localStorage.getItem("comethWalletAddress") || "",
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

// here we update the local Resources and push out a TX for updating the contract
export const vaultSponsorPlayer = async (amount: number) => {
  const {
    systemCalls: { mockLapuVaultFundPlayer },
  } = await getMUD();
  await doOptimisticLapuDelta(
    amount,
    async () =>
      await mockLapuVaultFundPlayer(
        getState().player.playerData.address,
        amount
      )
  );
};

export const doOptimisticLapuDelta = async (
  amount: number,
  fn: () => Promise<void>
) => {
  const prev = getState().player.playerData.LAPUtoBeConsolidated || 0;
  getState().player.setPlayerData({
    ...getState().player.playerData,
    LAPUtoBeConsolidated: prev + amount,
  });
  queueAsyncCall(async () => {
    await fn()
      .then(() => {
        const consolidatePrev =
          getState().player.playerData.LAPUtoBeConsolidated;
        getState().player.setPlayerData({
          ...getState().player.playerData,
          LAPUtoBeConsolidated: consolidatePrev - amount,
          resources: {
            ...getState().player.playerData.resources,
            LAPU: getState().player.playerData.resources.LAPU + amount,
          },
        });
      })
      .catch((e: unknown) => {
        console.log("Error in mockLapuVaultFundPlayer", e);
        const consolidatePrev =
          getState().player.playerData.LAPUtoBeConsolidated;
        getState().player.setPlayerData({
          ...getState().player.playerData,
          LAPUtoBeConsolidated: consolidatePrev - amount,
          resources: {
            ...getState().player.playerData.resources,
            LAPU: getState().player.playerData.resources.LAPU + amount,
          },
        });
      });
  });
};

// here we update the local Resources from the server
export const updatePlayerLapuBalance = async () => {
  const {
    systemCalls: { mudDefiLapuBalanceOf },
  } = await getMUD();
  const balance = (await mudDefiLapuBalanceOf(
    getState().player.playerData.address
  )) as number;
  getState().player?.setPlayerData({
    ...getState().player?.playerData,
    resources: {
      ...getState().player?.playerData?.resources,
      LAPU: parseInt(balance.toString()),
    },
  });
};
