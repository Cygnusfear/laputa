// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "../interfaces/IPoolAddressesProvider.sol";

contract MockPoolAddressProvider is IPoolAddressesProvider {
  address poolAddress;

  constructor(address poolAddress_) {
    poolAddress = poolAddress_;
  }

  /**
   * @notice Returns the address of the Pool proxy.
   * @return The Pool proxy address
   */
  function getPool() external view returns (address) {
    return poolAddress;
  }
}
