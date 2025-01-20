import * as dotenv from "dotenv";

import { ethers } from "hardhat";

dotenv.config();

async function main() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const OWNER_ADDRESS = process.env.OWNER_ADDRESS; // The owner whose grantees you want to list

    if (!CONTRACT_ADDRESS) {
        throw new Error("CONTRACT_ADDRESS is not defined in the .env file.");
    }

    if (!OWNER_ADDRESS) {
        throw new Error("OWNER_ADDRESS is not defined in the .env file.");
    }

    // Get the contract instance
    const HealthInfo = await ethers.getContractFactory("HealthInfo");
    const contract = HealthInfo.attach(CONTRACT_ADDRESS);

    console.log(`Fetching grantees for owner: ${OWNER_ADDRESS}`);

    try {
        const grantees = await contract.getGrantees(OWNER_ADDRESS);
        console.log(`Grantees for ${OWNER_ADDRESS}:`);
        grantees.forEach((grantee: string, index: number) => {
            console.log(`  ${index + 1}. ${grantee}`);
        });
    } catch (error) {
        console.error("Error fetching grantees:", error);
    }
}

main().catch((error) => {
    console.error("Script error:", error);
    process.exitCode = 1;
});
