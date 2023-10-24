// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
    const maToken = await hre.ethers.deployContract("MockERC20", ["MockAToken", "maToken"]);
    await maToken.waitForDeployment();
    const maTokenAddress = await maToken.getAddress();
    console.log("maTokenAddress", maTokenAddress);

    const mockPool = await hre.ethers.deployContract("MockPool", [maTokenAddress]);
    await mockPool.waitForDeployment();
    const mockPoolAddress = await mockPool.getAddress();
    console.log("mockPoolAddress", mockPoolAddress);

    const mockPoolAddressesProvider = await hre.ethers.deployContract("MockPoolAddressesProvider", [mockPoolAddress]);
    await mockPoolAddressesProvider.waitForDeployment();
    const mockPoolAddressesProviderAddress = await mockPoolAddressesProvider.getAddress();
    console.log("mockPoolAddressesProviderAddress", mockPoolAddressesProviderAddress);

    const mockDAI = await hre.ethers.deployContract("MockERC20", ["MockDAI", "mDAI"]);
    await mockDAI.waitForDeployment();
    const mockDAIAddress = await mockDAI.getAddress();
    console.log("mockDAIAddress", mockDAIAddress);

    const lapuVault = await hre.ethers.deployContract("LapuVault", ["0x15bc81b35a8498cee37E2C7B857538B006CeCAa5", mockDAIAddress, "LapuVault", "LAPU", mockPoolAddressesProviderAddress, maTokenAddress]);
    await lapuVault.waitForDeployment();
    const lapuVaultAddress = await lapuVault.getAddress();
    console.log("lapuVaultAddress", lapuVaultAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
