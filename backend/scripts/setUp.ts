import * as dotenv from "dotenv";

import { Contract, JsonRpcProvider, parseUnits } from "ethers";

import { ethers } from "hardhat";

dotenv.config(); // Load environment variables from .env

async function main() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const IPFS_HASHES = process.env.IPFS_HASHES ? process.env.IPFS_HASHES.split(",") : [];
    const ACCOUNTS = process.env.ACCOUNTS ? process.env.ACCOUNTS.split(",") : [];
    const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY
    const INFURA_API_KEY = process.env.INFURA_API_KEY

    if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS is not defined");
    if (!METAMASK_PRIVATE_KEY) throw new Error("METAMASK_PRIVATE_KEY is not defined");
    if (ACCOUNTS.length === 0) throw new Error("ACCOUNTS are not defined");
    if (IPFS_HASHES.length === 0) throw new Error("IPFS_HASHES are not defined");
    if (ACCOUNTS.length !== IPFS_HASHES.length) throw new Error("Each account must have a matching IPFS hash");

  
    const provider = new JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
      
    const signer = new ethers.Wallet(METAMASK_PRIVATE_KEY, provider);
    
    console.log('✅ Connected as:', signer.address);

    const HealthInfoFactory = await ethers.getContractFactory("HealthInfo");
    const contract = HealthInfoFactory.attach(CONTRACT_ADDRESS).connect(signer);

    const nonce = await provider.getTransactionCount(signer.address, "pending");
    console.log("Pending nonce:", nonce);
    
    
    for (let i = 0; i < ACCOUNTS.length; i++) {
        const account = ACCOUNTS[i];
        const ipfsHash = IPFS_HASHES[i];

        console.log(`Setting owner for IPFS hash: ${ipfsHash} to account: ${account}`);
        try {
            const tx = await (contract!.connect(signer!) as Contract).setOwner(ipfsHash, account, {
                gasLimit: 500000,  // Increase this if needed
                gasPrice: parseUnits("10", "gwei"), 
            });
            console.log("Transaction sent! Hash:", tx.hash);
            console.log("Waiting for transaction confirmation...");
            await tx.wait();
            console.log(`Owner set for account: ${account}`);
        } catch (error) {
            console.error(`Failed to set owner for account: ${account}`, error);
        }
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
