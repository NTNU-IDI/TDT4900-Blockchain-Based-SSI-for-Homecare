import { JsonRpcProvider } from "ethers";
import dotenv from "dotenv";
import { ethers } from "hardhat";

dotenv.config();

async function main() {
    const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY
    const INFURA_API_KEY = process.env.INFURA_API_KEY

    if (!METAMASK_PRIVATE_KEY) throw new Error("METAMASK_PRIVATE_KEY is not defined");
    if (!INFURA_API_KEY) throw new Error("METAMASK_PRIVATE_KEY is not defined");

    const provider = new JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
          
    const signer = new ethers.Wallet(METAMASK_PRIVATE_KEY, provider);
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
