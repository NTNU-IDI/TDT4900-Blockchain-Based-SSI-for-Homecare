import { Contract } from "ethers";
import dotenv from "dotenv";
import { ethers } from "hardhat";
import fs from "fs";

dotenv.config();


async function deployContract(): Promise<string> {
    console.log("Deploying contract...");
    const HealthInfo = await ethers.getContractFactory("HealthInfo");
    const healthInfo = await HealthInfo.deploy();
    await healthInfo.waitForDeployment();
    const contractAddress = await healthInfo.getAddress();
    console.log("Contract deployed to:", contractAddress);

    changeEnvContractAddress(contractAddress);
    return contractAddress;
}

async function changeEnvContractAddress(address: string){
    let envContent = '';
    if (fs.existsSync('.env')) {
        envContent = fs.readFileSync('.env', 'utf8');
    }

    // Append new contract address
    const newEntry = `CONTRACT_ADDRESS=${address}\n`;

    // Check if CONTRACT_ADDRESS already exists, replace it instead of appending
    if (envContent.includes('CONTRACT_ADDRESS=')) {
        envContent = envContent.replace(/CONTRACT_ADDRESS=.*/g, newEntry.trim());
    } else {
        envContent += newEntry;
    }

    // Write back the modified content
    fs.writeFileSync('.env', envContent);
}

async function main() {
    const contractAddress = await deployContract();
    const signers = await ethers.getSigners();
    const ACCOUNTS = signers.slice(0, 5).map(signer => signer.address);
    if (ACCOUNTS.length < 5) {
        throw new Error("Not enough accounts available in Hardhat. Ensure at least 5 accounts are configured.");
    }
    console.log("Using accounts:", ACCOUNTS);

     // Get signer
     const [signer] = await ethers.getSigners();
     //console.log("Using signer:", await signer.getAddress());
 
     // Attach to deployed contract
     const HealthInfoFactory = await ethers.getContractFactory("HealthInfo");
     const contract = HealthInfoFactory.attach(contractAddress).connect(signer);

     const ipfsHashes = process.env.IPFS_HASHES ? process.env.IPFS_HASHES.split(",") : [];

    for (let i = 0; i < ACCOUNTS.length; i++) {
        const account = ACCOUNTS[i];
        const ipfsHash = ipfsHashes[i];

        console.log(`Setting owner for IPFS hash: ${ipfsHash} to account: ${account}`);
        try {
            const tx = await (contract!.connect(signer!) as Contract).setOwner(ipfsHash, account);
            console.log("Waiting for transaction confirmation...");
            await tx.wait();
            console.log(`Owner set for account: ${account}`);
        } catch (error) {
            console.error(`Failed to set owner for account: ${account}`, error);
        }
    }
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
