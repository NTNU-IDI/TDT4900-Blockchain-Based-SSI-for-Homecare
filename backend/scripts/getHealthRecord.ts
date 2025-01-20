import * as dotenv from "dotenv";

import { ethers } from "hardhat";

dotenv.config();

async function main() {
    // Load the contract address from environment variables
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    if (!CONTRACT_ADDRESS) {
        throw new Error("CONTRACT_ADDRESS is not defined in the .env file.");
    }

    // Replace with the Ethereum address of the owner
    const OWNER_ADDRESS = process.env.OWNER_ADDRESS; // Replace with valid Ethereum address

    // Get the contract instance
    const HealthInfo = await ethers.getContractFactory("HealthInfo");
    const contract = HealthInfo.attach(CONTRACT_ADDRESS);

    // Call the getHealthRecord function
    const ipfsHash = await contract.getHealthRecord(OWNER_ADDRESS);
    console.log(`IPFS hash for owner ${OWNER_ADDRESS}: ${ipfsHash}`);
}

main().catch((error) => {
    console.error("Error:", error);
    process.exitCode = 1;
});
