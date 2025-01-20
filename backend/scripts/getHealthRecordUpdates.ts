import * as dotenv from "dotenv";

import { ethers } from "hardhat";

dotenv.config();

async function main() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const OWNER_ADDRESS = process.env.OWNER_ADDRESS; // Replace with the record owner address

    if (!CONTRACT_ADDRESS) {
        throw new Error("CONTRACT_ADDRESS is not defined in the .env file.");
    }

    // Get the contract instance
    const HealthInfo = await ethers.getContractFactory("HealthInfo");
    const contract = HealthInfo.attach(CONTRACT_ADDRESS);

    console.log(`Fetching updates for owner: ${OWNER_ADDRESS}`);

    try {
        // Fetch updates
        const [updaters, timestamps] = await contract.getUpdates(OWNER_ADDRESS);

        console.log("Update History:");
        updaters.forEach((updater: string, index: number) => {
            // Convert BigInt timestamp to Number for compatibility
            const timestamp = Number(timestamps[index]); // Change made here
            console.log(`  Update #${index + 1}:`);
            console.log(`    Updater: ${updater}`);
            console.log(`    Timestamp: ${new Date(timestamp * 1000).toISOString()}`);
        });
    } catch (error) {
        console.error("Error fetching updates:", error);
    }
}

main().catch((error) => {
    console.error("Script error:", error);
    process.exitCode = 1;
});
