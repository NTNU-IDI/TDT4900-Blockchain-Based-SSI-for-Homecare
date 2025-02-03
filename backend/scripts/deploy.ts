import { ethers } from "hardhat";

async function main() {
    const HealthInfo = await ethers.getContractFactory("HealthInfo");
    const healthInfo = await HealthInfo.deploy();

    console.log("Deploying contract...");
    await healthInfo.waitForDeployment()

    console.log("Contract deployed to address:", await healthInfo.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

