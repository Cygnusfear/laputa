// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { System } from "@latticexyz/world/src/System.sol";
import { GameSetting, PlayerDataDetail, PlayerDataDetailTableId } from "../codegen/index.sol";
import { getKeysInTable } from "@latticexyz/world-modules/src/modules/keysintable/getKeysInTable.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

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

  function defiDaiBalanceOf(address account) public view returns (uint256) {
    IERC20 dai = IERC20(GameSetting.getDaiAddress());
    return dai.balanceOf(account);
  }

  function defiLapuBalanceOf(address account) public view returns (uint256) {
    ILapuVault lapuVault = ILapuVault(GameSetting.getLapuVaultAddress());
    return lapuVault.balanceOf(account);
  }

  function defiGetTotalRewardBalance() public view returns (uint256) {
    // LAPU balance of this world contract = reward balance
    ILapuVault lapuVault = ILapuVault(GameSetting.getLapuVaultAddress());
    return lapuVault.balanceOf(address(this));
  }

  function defiSwapDaiToLapu(uint256 amount, address receiver) public returns (uint256) {
    IERC20 dai = IERC20(GameSetting.getDaiAddress());
    // transfer DAI from _msgSender to this contract first
    SafeERC20.safeTransferFrom(IERC20(dai), _msgSender(), address(this), amount);

    ILapuVault lapuVault = ILapuVault(GameSetting.getLapuVaultAddress());
    // approve DAI to be deposit into lapuVault
    dai.approve(address(lapuVault), amount);
    return lapuVault.deposit(amount, receiver);
  }

  function defiSwapLapuToDai(uint256 amount, address receiver) public returns (uint256) {
    ILapuVault lapuVault = ILapuVault(GameSetting.getLapuVaultAddress());
    return lapuVault.withdraw(amount, receiver, _msgSender());
  }

  function defiConsumesLapuFromPlayer(uint256 amount, address consumer) public {
    // transfer LAPU from consumer to this contract
    // p.s. LAPU balance of this world contract = reward balance
    ILapuVault lapuVault = ILapuVault(GameSetting.getLapuVaultAddress());
    SafeERC20.safeTransferFrom(IERC20(lapuVault), consumer, address(this), amount);
  }

  //TODO: implement a better solution than looping through all players
  function defiDistributeRewardsToPlayers() public returns (uint256) {
    uint256 totalAmount = defiGetTotalRewardBalance();
    if (totalAmount == 0) return 0;

    uint256 totalResidence = GameSetting.getTotalResidence();
    if (totalResidence == 0) return 0;

    ILapuVault lapuVault = ILapuVault(GameSetting.getLapuVaultAddress());

    bytes32[][] memory playerKeyss = getKeysInTable(PlayerDataDetailTableId);

    for (uint256 i = 0; i < playerKeyss.length; i++) {
      bytes32[] memory playerKeys = playerKeyss[i];
      if (playerKeys.length > 0) {
        bytes32 playerKey = playerKeys[0];
        address playerAddress = address(bytes20(playerKey));

        uint256 playerResidence = PlayerDataDetail.getResidence(playerKey);
        if (playerResidence == 0) continue;

        uint256 amount = (totalAmount * playerResidence) / totalResidence;

        if (amount > 0) {
          lapuVault.transfer(playerAddress, amount);
          PlayerDataDetail.setRewarded(playerKey, PlayerDataDetail.getRewarded(playerKey) + amount);
          GameSetting.setTotalRewarded(GameSetting.getTotalRewarded() + amount);
        }
      }
    }
  }
}
