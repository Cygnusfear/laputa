import { useComponentValue } from "@latticexyz/react";
import { singletonEntity } from "@latticexyz/store-sync/recs";

import { useMUD } from "./useMUD";

import { getState } from "./game/store";
import { useState } from "react";

export const MudExample = () => {
  const {
    components: { Counter },
    systemCalls: {
      mudGetAllFacilityEntityMetadatas,
      mudBuildFacility,
      mudGetEntityMetadataAtPosition,
      mudDefiDaiBalanceOf,
      mudMockDaiFaucet,
    },
  } = useMUD();

  const counter = useComponentValue(Counter, singletonEntity);
  const playerAddress = getState().player?.playerData?.address;
  const [playerDaiBalance, setPlayerDaiBalance] = useState<number | null>(null);

  return (
    <div>
      <div>
        Player Address: <span>{playerAddress ?? "??"}</span>
      </div>
      <div>
        Player DAI balance: <span>{playerDaiBalance ?? "??"}</span>
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
            await mudMockDaiFaucet(playerAddress, 1000)
          );
          const playerDaiBalance_ = (await mudDefiDaiBalanceOf(
            playerAddress
          )) as number;
          setPlayerDaiBalance(playerDaiBalance_);
        }}
      >
        mudMockDaiFaucet
      </button>
      <button
        type="button"
        className="px-100 py-100 rounded-md border border-gray-300 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        onClick={async (event) => {
          event.preventDefault();
          console.log("mudBuildFacility:", await mudBuildFacility());
        }}
      >
        mudBuildFacility
      </button>
      <button
        type="button"
        className="px-100 py-100 rounded-md border border-gray-300 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        onClick={async (event) => {
          event.preventDefault();
          console.log(
            "mudGetAllFacilityEntityMetadatas:",
            await mudGetAllFacilityEntityMetadatas()
          );
        }}
      >
        mudGetAllFacilityEntityMetadatas
      </button>
      <button
        type="button"
        className="px-100 py-100 rounded-md border border-gray-300 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        onClick={async (event) => {
          event.preventDefault();
          console.log(
            "mudGetEntityMetadataAtPosition:",
            await mudGetEntityMetadataAtPosition()
          );
        }}
      >
        mudGetEntityMetadataAtPosition
      </button>
    </div>
  );
};
