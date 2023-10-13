// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC4626 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC4626.sol
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./interfaces/IPoolAddressesProvider.sol";
import "./interfaces/IPool.sol";

contract LapuVault is ERC4626 {
  using Math for uint256;

  IPoolAddressesProvider public poolAddressProvider;

  constructor(
    IERC20 underlying_,
    string memory name_,
    string memory symbol_,
    IPoolAddressesProvider poolAddressProvider_
  ) ERC4626(underlying_) ERC20(name_, symbol_) {
    poolAddressProvider = poolAddressProvider_;
  }

  function convertToShares(uint256 assets) public view override returns (uint256) {
    return assets;
  }

  function convertToAssets(uint256 shares) public view override returns (uint256) {
    return shares;
  }

  function _convertToShares(uint256 assets, Math.Rounding rounding) internal view override returns (uint256) {
    return assets;
  }

  /**
   * @dev Internal conversion function (from shares to assets) with support for rounding direction.
   */
  function _convertToAssets(uint256 shares, Math.Rounding rounding) internal view override returns (uint256) {
    return shares;
  }

  function deposit(uint256 assets, address receiver) public virtual override returns (uint256) {
    uint256 maxAssets = maxDeposit(receiver);
    if (assets > maxAssets) {
      revert ERC4626ExceededMaxDeposit(receiver, assets, maxAssets);
    }

    uint256 shares = previewDeposit(assets);
    _deposit(_msgSender(), receiver, assets, shares);

    //deposit assets from this contract into DeFi pool
    address poolAddress = poolAddressProvider.getPool();
    IERC20(asset()).approve(poolAddress, assets);
    IPool(poolAddress).supply(asset(), assets, address(this), 0);

    return shares;
  }

  function withdraw(uint256 assets, address receiver, address owner) public virtual override returns (uint256) {
    uint256 maxAssets = maxWithdraw(owner);
    if (assets > maxAssets) {
      revert ERC4626ExceededMaxWithdraw(owner, assets, maxAssets);
    }

    //withdraw assets from DeFi pool to this contract
    address poolAddress = poolAddressProvider.getPool();
    IPool(poolAddress).withdraw(asset(), assets, address(this));

    uint256 shares = previewWithdraw(assets);
    _withdraw(_msgSender(), receiver, owner, assets, shares);

    return shares;
  }

  //TODO: harvest the yield from DeFi pool and turn it into LAPU
  //TODO: distribute LAPU tokens owned by this vault as player rewards
}
