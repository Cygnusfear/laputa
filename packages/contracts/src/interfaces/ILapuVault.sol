// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC4626 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC4626.sol
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import "./IPoolAddressesProvider.sol";
import "./IPool.sol";

interface ILapuVault is IERC20 {
  event LAPUMintedFromDeFiYield(uint256 amount);

  function convertToShares(uint256 assets) external view returns (uint256);

  function convertToAssets(uint256 shares) external view returns (uint256);

  function _convertToShares(uint256 assets, Math.Rounding rounding) external view returns (uint256);

  /**
   * @dev Internal conversion function (from shares to assets) with support for rounding direction.
   */
  function _convertToAssets(uint256 shares, Math.Rounding rounding) external view returns (uint256);

  /**
   * @dev emitting event Deposit(caller, receiver, assets, shares);
   */
  function deposit(uint256 assets, address receiver) external returns (uint256);

  /**
   * @dev emitting event Withdraw(caller, receiver, owner_, assets, shares)
   */
  function withdraw(uint256 assets, address receiver, address owner_) external returns (uint256);

  /**
   * @dev emitting event LAPUMintedFromDeFiYield(yield)
   */
  function mintLAPUAccordingToDeFiYield() external returns (uint256);
}
