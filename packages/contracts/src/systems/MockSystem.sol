// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { System } from "@latticexyz/world/src/System.sol";
import { GameSetting } from "../codegen/index.sol";

import "../interfaces/IMockERC20.sol";
import "../interfaces/ILapuVault.sol";

contract MockSystem is System {
  function mockDaiFacuet(address receiver, uint256 amount) public {
    IMockERC20 dai = IMockERC20(GameSetting.getDaiAddress());
    dai.faucet(receiver, amount);
  }

  function mockYieldGenerationFromDeFiPool(uint256 amount) public {
    //mock yield generation with the increase of aToken
    IMockERC20 dai = IMockERC20(GameSetting.getDaiAddress());
    IMockERC20 aDai = IMockERC20(GameSetting.getADaiAddress());
    dai.mint(GameSetting.getDefiPoolAddress(), amount);
    aDai.mint(GameSetting.getLapuVaultAddress(), amount);

    //and then mint LAPU according to the yield
    ILapuVault lapuVault = ILapuVault(GameSetting.getLapuVaultAddress());
    lapuVault.mintLAPUAccordingToDeFiYield();
  }

  //TODO: design reward distribution mechanism among players, i.e. depends on players' buildings
  //for now, calculate the distribution off chain and use this call to distribute reward to a specific player account
  function mockReleaseRewardToPlayer(address account, uint256 amount) public {
    ILapuVault lapuVault = ILapuVault(GameSetting.getLapuVaultAddress());
    lapuVault.transfer(account, amount);
  }
}
