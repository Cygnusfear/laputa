// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import { Context } from "@openzeppelin/contracts/utils/Context.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "../interfaces/IPool.sol";
import "../interfaces/IMockERC20.sol";
import "./MockERC20.sol";

contract MockPool is Context, IPool {
  IMockERC20 public aToken;

  constructor(IMockERC20 aToken_) {
    aToken = aToken_;
  }

  /**
   * @notice Supplies an `amount` of underlying asset into the reserve, receiving in return overlying aTokens.
   * - E.g. User supplies 100 USDC and gets in return 100 aUSDC
   * @param asset The address of the underlying asset to supply
   * @param amount The amount to be supplied
   * @param onBehalfOf The address that will receive the aTokens, same as msg.sender if the user
   *   wants to receive them on his own wallet, or a different address if the beneficiary of aTokens
   *   is a different wallet
   * @param referralCode Code used to register the integrator originating the operation, for potential rewards.
   *   0 if the action is executed directly by the user, without any middle-man
   */
  function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external {
    //transfer amount of asset from msg.sender to pool
    SafeERC20.safeTransferFrom(IERC20(asset), _msgSender(), address(this), amount);
    //mint aToken to onBehalfOf
    aToken.mint(onBehalfOf, amount);
  }

  /**
   * @notice Withdraws an `amount` of underlying asset from the reserve, burning the equivalent aTokens owned
   * E.g. User has 100 aUSDC, calls withdraw() and receives 100 USDC, burning the 100 aUSDC
   * @param asset The address of the underlying asset to withdraw
   * @param amount The underlying amount to be withdrawn
   *   - Send the value type(uint256).max in order to withdraw the whole aToken balance
   * @param to The address that will receive the underlying, same as msg.sender if the user
   *   wants to receive it on his own wallet, or a different address if the beneficiary is a
   *   different wallet
   * @return The final amount withdrawn
   */
  function withdraw(address asset, uint256 amount, address to) external returns (uint256) {
    //burn aToken from msg.sender
    aToken.burn(_msgSender(), amount);
    //transfer asset to msg.sender
    SafeERC20.safeTransfer(IERC20(asset), to, amount);
  }
}
