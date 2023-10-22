/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import { getComponentValue } from "@latticexyz/recs";
import { singletonEntity } from "@latticexyz/store-sync/recs";
import { Vector3 } from "three";
import { ethers } from "ethers";

import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";

import IERC20Abi from "contracts/out/IERC20.sol/IERC20.abi.json";
import ILapuVaultAbi from "contracts/out/ILapuVault.sol/ILapuVault.abi.json";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   * - Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/react/packages/client/src/mud/setupNetwork.ts#L31).
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/react/packages/client/src/mud/setupNetwork.ts#L39).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs (https://github.com/latticexyz/mud/blob/26dabb34321eedff7a43f3fcb46da4f3f5ba3708/templates/react/packages/client/src/mud/setupNetwork.ts#L39).
   */
  {
    worldContract,
    waitForTransaction,
    publicClient,
    walletClient,
    worldAddress,
  }: SetupNetworkResult,
  {
    Counter,
    Position,
    Orientation,
    EntityType,
    OwnedBy,
    GameSetting,
    EntityTypeDetail,
  }: ClientComponents
) {
  const defaultVector3 = new Vector3(1, 0, 3);

  const delay = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const increment = async () => {
    /*
     * Because IncrementSystem
     * (https://mud.dev/tutorials/walkthrough/minimal-onchain#incrementsystemsol)
     * is in the root namespace, `.increment` can be called directly
     * on the World contract.
     */
    const tx = await worldContract.write.increment();
    await waitForTransaction(tx);
    return getComponentValue(Counter, singletonEntity);
  };

  const mudGetEntityType = async (entityKey) => {
    return getComponentValue(EntityType, entityKey);
  };

  const mudGetOwnedBy = async (entityKey) => {
    return getComponentValue(OwnedBy, entityKey);
  };

  const mudGetOrientation = async (entityKey) => {
    return getComponentValue(Orientation, entityKey);
  };

  const mudGetPosition = async (entityKey) => {
    return getComponentValue(Position, entityKey);
  };

  const mudPositionToEntityKey = (pos: Vector3) => {
    return ethers.utils.solidityKeccak256(
      ["uint256", "uint256", "uint256"],
      [pos.x, pos.y, pos.z]
    );
  };

  const mudIsPositionEmpty = async (pos: Vector3 = defaultVector3) => {
    const res = await worldContract.read.isPositionEmpty([pos.x, pos.y, pos.z]);
    return res;
  };

  const mudGetLapuBuildingCost = async (entityTypeId: number) => {
    const entityTypeDetail = await getComponentValue(
      EntityTypeDetail,
      entityTypeId
    );
    return entityTypeDetail?.buildingCostLapu || 400;
  };

  const mudBuildFacility = async (
    entityTypeId: number = 10,
    x: number = defaultVector3.x,
    y: number = defaultVector3.y,
    z: number = defaultVector3.z,
    yaw: number = 0,
    color: string = "#ff00ff",
    variant: number = 0
  ) => {
    //approve mud world to spend LAPU for building
    const buildingCostLapu = await mudGetLapuBuildingCost(entityTypeId);
    console.log(
      "mudBuildFacility approveLapuToMudWorldForTheConnectedPlayer",
      buildingCostLapu
    );
    await approveLapuToMudWorldForTheConnectedPlayer(buildingCostLapu);
    console.log(
      "mudBuildFacility approveLapuToMudWorldForTheConnectedPlayer done"
    );

    delay(1000);
    const tx = await worldContract.write.buildFacility([
      entityTypeId,
      x,
      y,
      z,
      yaw,
      color,
      variant,
    ]);
    await waitForTransaction(tx);
    return tx;
  };

  const mudGetEntityMetadataAtPosition = async (
    pos: Vector3 = defaultVector3
  ) => {
    const isPosEmpty = await mudIsPositionEmpty(pos);
    if (isPosEmpty) {
      return null;
    }

    const entityKey = mudPositionToEntityKey(pos);
    const entityTypeId = await mudGetEntityType(entityKey);
    const orientation = await mudGetOrientation(entityKey);
    const ownedBy = await mudGetOwnedBy(entityKey);

    return {
      entityKey,
      position: pos,
      entityTypeId,
      orientation,
      ownedBy,
    };
  };

  /*
  example output
  [
  {
    "entityKey": "0x5c6090c0461491a2941743bda5c3658bf1ea53bbd3edcde54e16205e18b45792",
    "position": {
      "x": 1,
      "y": 0,
      "z": 1,
      "__staticData": "0x000000010000000000000001",
      "__encodedLengths": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "__dynamicData": "0x"
    },
    "entityTypeId": {
      "typeId": 10,
      "__staticData": "0x0000000a"
    },
    "orientation": {
      "yaw": 0,
      "__staticData": "0x00000000"
    },
    "ownedBy": {
      "owner": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "__staticData": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
    }
  }
  ]
  */
  const mudGetAllFacilityEntityMetadatas = async () => {
    const allEntityKeys = await worldContract.read.getAllFacilityEntityKeys();

    const allEntityMetadatas = [];

    for (const entityKeyArray of allEntityKeys) {
      for (const entityKey of entityKeyArray) {
        const entityPos = await mudGetPosition(entityKey);
        const entityTypeId = await mudGetEntityType(entityKey);
        const orientation = await mudGetOrientation(entityKey);
        const ownedBy = await mudGetOwnedBy(entityKey);

        const entityMetadata = {
          entityKey,
          position: entityPos,
          entityTypeId,
          orientation,
          ownedBy,
        };

        allEntityMetadatas.push(entityMetadata);
      }
    }

    return allEntityMetadatas;
  };

  const mudMockDaiFaucet = async (playerAddress, amount) => {
    const tx = await worldContract.write.mockDaiFaucet([playerAddress, amount]);
    await waitForTransaction(tx);
    return tx;
  };

  const mudDefiDaiBalanceOf = async (playerAddress) => {
    const res = await worldContract.read.defiDaiBalanceOf([playerAddress]);
    return res;
  };

  const mudDefiLapuBalanceOf = async (playerAddress) => {
    const res = await worldContract.read.defiLapuBalanceOf([playerAddress]);
    return res;
  };

  const mudDefiGetTotalRewardBalance = async () => {
    const res = await worldContract.read.defiGetTotalRewardBalance();
    return res;
  };

  const approveDaiToLapuVaultForTheConnectedPlayer = async (amount) => {
    const gameSetting = await getComponentValue(GameSetting, singletonEntity);
    const { request } = await publicClient.simulateContract({
      address: gameSetting?.daiAddress,
      abi: IERC20Abi,
      functionName: "approve",
      args: [gameSetting?.lapuVaultAddress, amount],
      account: walletClient?.account,
    });
    const res = await walletClient.writeContract(request);
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: res,
    });
    return transaction;
  };

  const approveLapuToMudWorldForTheConnectedPlayer = async (amount) => {
    const gameSetting = await getComponentValue(GameSetting, singletonEntity);
    const { request } = await publicClient.simulateContract({
      address: gameSetting?.lapuVaultAddress,
      abi: IERC20Abi,
      functionName: "approve",
      args: [worldAddress, amount],
      account: walletClient?.account,
    });
    const res = await walletClient.writeContract(request);
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: res,
    });
    return transaction;
  };

  const depositDaiToLapuVaultForTheConnectedPlayer = async (amount) => {
    const gameSetting = await getComponentValue(GameSetting, singletonEntity);
    console.log("gameSetting?.lapuVaultAddress", gameSetting?.lapuVaultAddress);
    console.log(
      "depositDaiToLapuVaultForTheConnectedPlayer walletClient?.account.address",
      walletClient?.account.address
    );
    const { request } = await publicClient.simulateContract({
      address: gameSetting?.lapuVaultAddress,
      abi: ILapuVaultAbi,
      functionName: "deposit",
      args: [amount, walletClient?.account.address],
      account: walletClient?.account,
    });
    const res = await walletClient.writeContract(request);
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: res,
    });
    return transaction;
  };

  const withdrawDaiFromLapuVaultForTheConnectedPlayer = async (amount) => {
    const gameSetting = await getComponentValue(GameSetting, singletonEntity);
    const { request } = await publicClient.simulateContract({
      address: gameSetting?.lapuVaultAddress,
      abi: ILapuVaultAbi,
      functionName: "withdraw",
      args: [
        amount,
        walletClient?.account.address,
        walletClient?.account.address,
      ],
      account: walletClient?.account,
    });
    const res = await walletClient.writeContract(request);
    const transaction = await publicClient.waitForTransactionReceipt({
      hash: res,
    });
    return transaction;
  };

  const mudDefiConsumesLapuFromPlayer = async (amount, playerAddress) => {
    const tx = await worldContract.write.defiConsumesLapuFromPlayer([
      amount,
      playerAddress,
    ]);
    await waitForTransaction(tx);
    return tx;
  };

  const mudMockYieldGenerationFromDeFiPool = async (amount) => {
    console.log("mudMockYieldGenerationFromDeFiPool", amount);
    const tx = await worldContract.write.mockYieldGenerationFromDeFiPool([
      amount,
    ]);
    await waitForTransaction(tx);
    return tx;
  };

  const mudMockReleaseRewardToPlayer = async (playerAddress, amount) => {
    const tx = await worldContract.write.mockReleaseRewardToPlayer([
      playerAddress,
      amount,
    ]);
    await waitForTransaction(tx);
    return tx;
  };

  const lapuVaultGetTotalSupply = async () => {
    const gameSetting = await getComponentValue(GameSetting, singletonEntity);
    const data = await publicClient.readContract({
      address: gameSetting?.lapuVaultAddress,
      abi: IERC20Abi,
      functionName: "totalSupply",
    });
    return data;
  };

  const mockLapuVaultFundPlayer = async (playerAddress, amount = 1000) => {
    console.log("mockLapuVaultFundPlayer start", playerAddress, amount);
    await mudMockDaiFaucet(playerAddress, amount);
    console.log("mudMockDaiFaucet done");
    delay(1000);
    await approveDaiToLapuVaultForTheConnectedPlayer(amount);
    console.log("approveDaiToLapuVaultForTheConnectedPlayer done");
    delay(1000);
    await depositDaiToLapuVaultForTheConnectedPlayer(amount);
    console.log("mockLapuVaultFundPlayer done", playerAddress, amount);
  };

  const mudDefiDistributeRewardsToPlayers = async () => {
    console.log("mudDefiDistributeRewardsToPlayers");
    const tx = await worldContract.write.defiDistributeRewardsToPlayers();
    await waitForTransaction(tx);
    return tx;
  };

  return {
    increment,
    mudGetEntityType,
    mudGetOwnedBy,
    mudGetOrientation,
    mudGetPosition,
    mudPositionToEntityKey,
    mudIsPositionEmpty,
    mudBuildFacility,
    mudGetEntityMetadataAtPosition,
    mudGetAllFacilityEntityMetadatas,
    mudMockDaiFaucet,
    mudDefiDaiBalanceOf,
    mudDefiLapuBalanceOf,
    mudDefiGetTotalRewardBalance,
    approveDaiToLapuVaultForTheConnectedPlayer,
    approveLapuToMudWorldForTheConnectedPlayer,
    depositDaiToLapuVaultForTheConnectedPlayer,
    withdrawDaiFromLapuVaultForTheConnectedPlayer,
    mudDefiConsumesLapuFromPlayer,
    mudMockYieldGenerationFromDeFiPool,
    mudMockReleaseRewardToPlayer,
    lapuVaultGetTotalSupply,
    mockLapuVaultFundPlayer,
    mudDefiDistributeRewardsToPlayers,
  };
}
