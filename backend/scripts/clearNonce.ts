import * as dotenv from "dotenv";

import { Contract, parseUnits } from "ethers";

import { ethers } from "hardhat";

dotenv.config(); // Load environment variables from .env

async function main() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS is not defined");

    // Get signer
    const [signer] = await ethers.getSigners();
    console.log("Using signer:", await signer.getAddress());

    const HealthInfoFactory = await ethers.getContractFactory("HealthInfo");
    const contract = HealthInfoFactory.attach(CONTRACT_ADDRESS).connect(signer);

    const provider = ethers.provider;
    let firstPendingNonce = await provider.getTransactionCount(signer.address, "pending");
    let latestNonce = await provider.getTransactionCount(signer.address, "latest");

    console.log(`First pending nonce: ${firstPendingNonce}`);
    console.log(`Latest confirmed nonce: ${latestNonce}`);

    if (firstPendingNonce === latestNonce) {
        console.log("No stuck transactions found. Exiting...");
        return;
    }

    for (let i = firstPendingNonce; i < latestNonce; i++) {
        try {
            const tx = await signer.sendTransaction({
                to: signer.address,  // Sending to self to replace stuck transactions
                nonce: i,  // Start from nonce 1, go up
                gasLimit: 21000,  // Minimum gas for transaction
                gasPrice: ethers.parseUnits("150", "gwei"),  // High gas to ensure confirmation
                value: ethers.parseEther("0"),  // No ETH, just replacing
            });
        
            console.log(`Replacement transaction sent for nonce ${i}:`, tx.hash);
            await tx.wait();
            console.log(`Nonce ${i} cleared.`);
        } catch (error) {
            console.error(`❌ Failed to replace nonce ${i}:`, error);
            return;  // Exit to prevent multiple failures
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
