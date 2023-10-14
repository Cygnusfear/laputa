// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC4626 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/extensions/ERC4626.sol
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IPoolAddressesProvider.sol";
import "./interfaces/IPool.sol";

contract LapuVault is Ownable, ERC4626 {
  using Math for uint256;

  IPoolAddressesProvider public poolAddressProvider;
  IERC20 public aToken;

  constructor(
    address initialOwner_,
    IERC20 underlying_,
    string memory name_,
    string memory symbol_,
    IPoolAddressesProvider poolAddressProvider_,
    IERC20 aToken_
  ) Ownable(initialOwner_) ERC4626(underlying_) ERC20(name_, symbol_) {
    poolAddressProvider = poolAddressProvider_;
    aToken = aToken_;
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

  function withdraw(uint256 assets, address receiver, address owner_) public virtual override returns (uint256) {
    uint256 maxAssets = maxWithdraw(owner_);
    if (assets > maxAssets) {
      revert ERC4626ExceededMaxWithdraw(owner_, assets, maxAssets);
    }

    //withdraw assets from DeFi pool to this contract
    address poolAddress = poolAddressProvider.getPool();
    IPool(poolAddress).withdraw(asset(), assets, address(this));

    uint256 shares = previewWithdraw(assets);
    _withdraw(_msgSender(), receiver, owner_, assets, shares);

    return shares;
  }

  function mintLAPUAccordingToDeFiYield() external onlyOwner returns (uint256) {
    uint256 currentLAPUTotalShare = totalSupply();
    uint256 currentATokenBalance = aToken.balanceOf(address(this));
    if (currentATokenBalance > currentLAPUTotalShare) {
      uint256 yield = currentATokenBalance - currentLAPUTotalShare;
      //mint the yield as new LAPU shares owned by this contract, such that they can be distributed to players as rewards at a later time
      _mint(address(this), yield);
      return yield;
    } else {
      return 0;
    }
  }

  function transferLAPURewardsTo(address to, uint256 amount) external onlyOwner {
    require(to != address(0), "LapuVault: cannot transfer to zero address");
    require(amount > 0, "LapuVault: cannot transfer zero amount");
    require(amount <= balanceOf(address(this)), "LapuVault: insufficient balance");
    _transfer(address(this), to, amount);
  }

  //TODO: add events
}
