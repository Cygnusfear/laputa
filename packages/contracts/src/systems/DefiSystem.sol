// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { System } from "@latticexyz/world/src/System.sol";
import { GameSetting } from "../codegen/index.sol";

import "../interfaces/IMockERC20.sol";
import "../interfaces/ILapuVault.sol";

contract DefiSystem is System {
  function defiAssignContractAddresses(
    address aDaiAddress_,
    address defiPoolAddress_,
    address daiAddress_,
    address lapuVaultAddress_
  ) public {
    GameSetting.setADaiAddress(aDaiAddress_);
    GameSetting.setDefiPoolAddress(defiPoolAddress_);
    GameSetting.setDaiAddress(daiAddress_);
    GameSetting.setLapuVaultAddress(lapuVaultAddress_);
  }

  function defiSimulateYieldGenerationFromPool(uint256 amount) public {
    IMockERC20 dai = IMockERC20(GameSetting.getDaiAddress());
    IMockERC20 aDai = IMockERC20(GameSetting.getADaiAddress());
    dai.mint(GameSetting.getDefiPoolAddress(), amount);
    aDai.mint(GameSetting.getLapuVaultAddress(), amount);
  }

  function defiHarvestYieldToRewardPlayers() public {
    ILapuVault lapuVault = ILapuVault(GameSetting.getLapuVaultAddress());
    lapuVault.mintLAPUAccordingToDeFiYield();
  }
}
