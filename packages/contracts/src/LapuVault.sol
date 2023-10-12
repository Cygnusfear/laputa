// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { ERC4626 } from "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Math } from "@openzeppelin/contracts/utils/math/Math.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LapuVault is ERC4626 {
  using Math for uint256;

  constructor(
    IERC20 underlying_,
    string memory name_,
    string memory symbol_
  ) ERC4626(underlying_) ERC20(name_, symbol_) {
    //_mint(msg.sender, 1000000);
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
}
