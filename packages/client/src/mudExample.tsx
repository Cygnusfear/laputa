import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";

import { useMUD } from "./useMUD";

import { getState } from "./game/store";
import { useState, useEffect } from "react";

export const MudExample = () => {
  const {
    components: { Counter, GameSetting },
    systemCalls: {
      mudDefiDaiBalanceOf,
      approveDaiToLapuVaultForTheConnectedPlayer,
      approveLapuToMudWorldForTheConnectedPlayer,
      depositDaiToLapuVaultForTheConnectedPlayer,
      withdrawDaiFromLapuVaultForTheConnectedPlayer,
      mudDefiLapuBalanceOf,
      mudDefiGetTotalRewardBalance,
      mudMockYieldGenerationFromDeFiPool,
      lapuVaultGetTotalSupply,
      mockLapuVaultFundPlayer,
      mudDefiDistributeRewardsToPlayers,
    },
  } = useMUD();

  const defaultTestAmount = 1000;
  const defaultConsumeAmount = 400;
  const defaultYieldAmount = 50;

  const counter = useComponentValue(Counter, singletonEntity);
  const gameSetting = useComponentValue(GameSetting, singletonEntity);
  const playerAddress = getState().player?.playerData?.address;
  const [playerDaiBalance, setPlayerDaiBalance] = useState<number | null>(null);
  const [playerLapuBalance, setPlayerLapuBalance] = useState<number | null>(
    null
  );
  const [totalRewardBalance, setTotalRewardBalance] = useState<number | null>(
    null
  );
  const [lapuVaultTvl, setLapuVaultTvl] = useState<bigint | null>(0);
  const [backgroundTxEnabled, setBackgroundTxEnabled] =
    useState<boolean>(false);

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

      const lapuVaultTvl_ = (await lapuVaultGetTotalSupply()) as bigint;
      setLapuVaultTvl(lapuVaultTvl_);
    };

    const refreshDataIntervalId = setInterval(refreshData, 3000);
    return () => {
      clearInterval(refreshDataIntervalId);
    };
  }, [
    mudDefiDaiBalanceOf,
    mudDefiLapuBalanceOf,
    mudDefiGetTotalRewardBalance,
    playerAddress,
    lapuVaultGetTotalSupply,
  ]);

  useEffect(() => {
    const executeBackgroundTx = async () => {
      const rewardBalance = (await mudDefiGetTotalRewardBalance()) as number;
      if (rewardBalance > 0) {
        await mudDefiDistributeRewardsToPlayers();
      } else {
        await mudMockYieldGenerationFromDeFiPool(defaultYieldAmount);
      }
    };

    const backgroundTxIntervalId = setInterval(() => {
      if (backgroundTxEnabled) {
        executeBackgroundTx();
      }
    }, 30000);
    return () => {
      clearInterval(backgroundTxIntervalId);
    };
  }, [
    backgroundTxEnabled,
    mudDefiGetTotalRewardBalance,
    mudMockYieldGenerationFromDeFiPool,
    mudDefiDistributeRewardsToPlayers,
  ]);

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
        LAPUTA:{" "}
        <span>
          Reward balance {totalRewardBalance?.toString() ?? "??"} LAPU
        </span>{" "}
        <span>
          Total rewarded {gameSetting?.totalRewarded?.toString() ?? "??"} LAPU
        </span>
      </div>
      <div>
        LAPU VAULT TVL: <span>{lapuVaultTvl?.toString() ?? "??"} DAI</span>
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
            "mockLapuVaultFundPlayer:",
            await mockLapuVaultFundPlayer(playerAddress)
          );
        }}
      >
        FundPlayer
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
        }}
      >
        approveLapu
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
      <button
        type="button"
        className="px-100 py-100 rounded-md border border-gray-300 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        onClick={async (event) => {
          event.preventDefault();
          console.log("toggle backgroundTxEnabled from:", backgroundTxEnabled);
          setBackgroundTxEnabled(!backgroundTxEnabled);
        }}
      >
        {backgroundTxEnabled ? "Disable Background Tx" : "Enable Background Tx"}
      </button>
    </div>
  );
};
