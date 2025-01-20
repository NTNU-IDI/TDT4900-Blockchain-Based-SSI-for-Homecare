import * as dotenv from "dotenv";

import { ethers } from "hardhat";

dotenv.config();

async function main() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const GRANTEE_ADDRESS = process.env.GRANTEE_ADDRESS; // Address to grant access to

    if (!CONTRACT_ADDRESS) {
        throw new Error("CONTRACT_ADDRESS is not defined in the .env file.");
    }

    if (!GRANTEE_ADDRESS) {
        throw new Error("GRANTEE_ADDRESS is not defined in the .env file.");
    }

    // Get signer (the record owner)
    const [signer] = await ethers.getSigners();

    // Attach to the deployed contract
    const HealthInfo = await ethers.getContractFactory("HealthInfo");
    const contract = HealthInfo.attach(CONTRACT_ADDRESS);

    console.log(`Granting access to ${GRANTEE_ADDRESS} using account: ${signer.address}`);

    // Grant access
    const tx = await contract.connect(signer).grantAccess(GRANTEE_ADDRESS);
    console.log("Transaction sent. Waiting for confirmation...");
    await tx.wait();

    console.log(`Access granted to: ${GRANTEE_ADDRESS}`);
}

main().catch((error) => {
    console.error("Error:", error);
    process.exitCode = 1;
});
