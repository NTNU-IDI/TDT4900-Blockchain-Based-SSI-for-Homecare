import dotenv from "dotenv";
import { ethers } from "hardhat";

dotenv.config();

async function main() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

    if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS is not defined");

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
                to: signer.address, 
                nonce: i,
                gasLimit: 21000,
                gasPrice: ethers.parseUnits("150", "gwei"),
                value: ethers.parseEther("0"),
            });
        
            console.log(`Replacement transaction sent for nonce ${i}:`, tx.hash);
            await tx.wait();
            console.log(`Nonce ${i} cleared.`);
        } catch (error) {
            console.error(`Failed to replace nonce ${i}:`, error);
            return;
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
