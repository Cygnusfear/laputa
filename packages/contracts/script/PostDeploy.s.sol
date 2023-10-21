// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

import { Script } from "forge-std/Script.sol";
import { console } from "forge-std/console.sol";
import { IWorld } from "../src/codegen/world/IWorld.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "../src/interfaces/IMockERC20.sol";
import "../src/mock/MockPool.sol";
import "../src/interfaces/IPoolAddressesProvider.sol";
import "../src/mock/MockPoolAddressesProvider.sol";
import "../src/mock/MockERC20.sol";
import "../src/LapuVault.sol";

contract PostDeploy is Script {
  function run(address worldAddress) external {
    // Load the private key from the `PRIVATE_KEY` environment variable (in .env)
    uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

    // Start broadcasting transactions from the deployer account
    vm.startBroadcast(deployerPrivateKey);

    // ------------------ EXAMPLES ------------------

    // Call increment on the world via the registered function selector
    uint32 newValue = IWorld(worldAddress).increment();
    console.log("Increment via IWorld:", newValue);

    // Deploy mock tokens and mock pool
    MockERC20 mockAToken = new MockERC20("MockAToken", "maToken");
    console.log("mockAToken deployed at:", address(mockAToken));
    MockPool mockPool = new MockPool(IMockERC20(mockAToken));
    console.log("mockPool deployed at:", address(mockPool));
    MockPoolAddressesProvider mockPoolAddressesProvider = new MockPoolAddressesProvider(address(mockPool));
    console.log("mockPoolAddressesProvider deployed at:", address(mockPoolAddressesProvider));
    MockERC20 mockDAI = new MockERC20("MockDAI", "mDAI");
    console.log("mockDAI deployed at:", address(mockDAI));

    // Deploy LapuVault
    LapuVault lapuVault = new LapuVault(
      worldAddress,
      IERC20(address(mockDAI)),
      "LapuVault",
      "LAPU",
      IPoolAddressesProvider(mockPoolAddressesProvider),
      IERC20(address(mockAToken))
    );
    console.log("lapuVault deployed at:", address(lapuVault));
    IWorld(worldAddress).defiAssignContractAddresses(
      address(mockAToken),
      address(mockPool),
      address(mockDAI),
      address(lapuVault)
    );

    IWorld(worldAddress).facilitySystemSetupEntityTypeDetails();

    vm.stopBroadcast();
  }
}
