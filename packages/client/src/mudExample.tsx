import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";

import { useMUD } from "./useMUD";

import { getState } from "./game/store";
import { useState, useEffect } from "react";

export const MudExample = () => {
  const {
    components: { Counter },
    systemCalls: {
      mudDefiDaiBalanceOf,
      mudMockDaiFaucet,
      approveDaiToLapuVaultForTheConnectedPlayer,
      approveLapuToMudWorldForTheConnectedPlayer,
      depositDaiToLapuVaultForTheConnectedPlayer,
      withdrawDaiFromLapuVaultForTheConnectedPlayer,
      mudDefiLapuBalanceOf,
      mudDefiConsumesLapuFromPlayer,
      mudDefiGetTotalRewardBalance,
      mudMockYieldGenerationFromDeFiPool,
      mudMockReleaseRewardToPlayer,
    },
  } = useMUD();

  const defaultTestAmount = 1000;
  const defaultConsumeAmount = 100;
  const defaultYieldAmount = 50;
  const defaultRewardAmount = 30;

  const counter = useComponentValue(Counter, singletonEntity);
  const playerAddress = getState().player?.playerData?.address;
  const [playerDaiBalance, setPlayerDaiBalance] = useState<number | null>(null);
  const [playerLapuBalance, setPlayerLapuBalance] = useState<number | null>(
    null
  );
  const [totalRewardBalance, setTotalRewardBalance] = useState<number | null>(
    null
  );

  useEffect(() => {
    const refreshData = async () => {
      const playerDaiBalance_ = (await mudDefiDaiBalanceOf(
        playerAddress
      )) as number;
      setPlayerDaiBalance(playerDaiBalance_);

      const playerLapuBalance_ = (await mudDefiLapuBalanceOf(
        playerAddress
      )) as number;
      setPlayerLapuBalance(playerLapuBalance_);

      const totalRewardBalance_ =
        (await mudDefiGetTotalRewardBalance()) as number;
      setTotalRewardBalance(totalRewardBalance_);
    };

    const refreshDataIntervalId = setInterval(refreshData, 1000);
    return () => {
      clearInterval(refreshDataIntervalId);
    };
  }, [
    mudDefiDaiBalanceOf,
    mudDefiLapuBalanceOf,
    mudDefiGetTotalRewardBalance,
    playerAddress,
  ]);

  useEffect(() => {
    const generateYieldIntervalId = setInterval(() => {
      mudMockYieldGenerationFromDeFiPool(defaultYieldAmount);
    }, 10000);
    return () => {
      clearInterval(generateYieldIntervalId);
    };
  }, [mudMockYieldGenerationFromDeFiPool]);

  useEffect(() => {
    const rewardPlayerIntervalId = setInterval(() => {
      mudMockReleaseRewardToPlayer(playerAddress, defaultRewardAmount);
    }, 15000);
    return () => {
      clearInterval(rewardPlayerIntervalId);
    };
  }, [playerAddress, mudMockReleaseRewardToPlayer]);

  const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  return (
    <div>
      <div>
        Player balance: <span>{playerDaiBalance?.toString() ?? "??"} DAI</span>{" "}
        <span> {playerLapuBalance?.toString() ?? "??"} LAPU</span>
      </div>
      <div>
        Reward balance:{" "}
        <span>{totalRewardBalance?.toString() ?? "??"} LAPU</span>
      </div>
      <div>
        Counter: <span>{counter?.value ?? "??"}</span>
      </div>
      <button
        type="button"
        className="px-100 py-100 rounded-md border border-gray-300 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        onClick={async (event) => {
          event.preventDefault();
          console.log(
            "mudMockDaiFaucet:",
            await mudMockDaiFaucet(playerAddress, defaultTestAmount)
          );
          const playerDaiBalance_ = (await mudDefiDaiBalanceOf(
            playerAddress
          )) as number;
          console.log("playerDaiBalance_:", playerDaiBalance_);
          setPlayerDaiBalance(playerDaiBalance_);
        }}
      >
        getDaiFromFaucet
      </button>
      <button
        type="button"
        className="px-100 py-100 rounded-md border border-gray-300 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        onClick={async (event) => {
          event.preventDefault();
          console.log(
            "approveDaiToLapuVaultForTheConnectedPlayer:",
            await approveDaiToLapuVaultForTheConnectedPlayer(defaultTestAmount)
          );
          await delay(1000);
          console.log(
            "depositDaiToLapuVaultForTheConnectedPlayer:",
            await depositDaiToLapuVaultForTheConnectedPlayer(defaultTestAmount)
          );
        }}
      >
        swapDaiToLapu
      </button>
      <button
        type="button"
        className="px-100 py-100 rounded-md border border-gray-300 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        onClick={async (event) => {
          event.preventDefault();
          console.log(
            "approveLapuToMudWorldForTheConnectedPlayer:",
            await approveLapuToMudWorldForTheConnectedPlayer(
              defaultConsumeAmount
            )
          );
          await delay(1000);
          console.log(
            "mudDefiConsumesLapuFromPlayer:",
            await mudDefiConsumesLapuFromPlayer(
              defaultConsumeAmount,
              playerAddress
            )
          );
        }}
      >
        consumeLapu
      </button>
      <button
        type="button"
        className="px-100 py-100 rounded-md border border-gray-300 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        onClick={async (event) => {
          event.preventDefault();
          console.log(
            "withdrawDaiFromLapuVaultForTheConnectedPlayer:",
            await withdrawDaiFromLapuVaultForTheConnectedPlayer(
              defaultConsumeAmount
            )
          );
        }}
      >
        swapLapuToDai
      </button>
    </div>
  );
};
