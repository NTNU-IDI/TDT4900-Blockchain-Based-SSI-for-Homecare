import * as dotenv from "dotenv";

import { Contract } from "ethers";
import { ethers } from "hardhat";

dotenv.config(); // Load environment variables from .env

async function main() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const IPFS_HASHES = process.env.IPFS_HASHES ? process.env.IPFS_HASHES.split(",") : [];
    const ACCOUNTS = process.env.ACCOUNTS ? process.env.ACCOUNTS.split(",") : [];

    if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS is not defined");
    if (ACCOUNTS.length === 0) throw new Error("ACCOUNTS are not defined");
    if (IPFS_HASHES.length === 0) throw new Error("IPFS_HASHES are not defined");
    if (ACCOUNTS.length !== IPFS_HASHES.length) throw new Error("Each account must have a matching IPFS hash");

    // Get signer
    const [signer] = await ethers.getSigners();
    //console.log("Using signer:", await signer.getAddress());

    // Attach to deployed contract
    const HealthInfoFactory = await ethers.getContractFactory("HealthInfo");
    const contract = HealthInfoFactory.attach(CONTRACT_ADDRESS).connect(signer);

    for (let i = 0; i < ACCOUNTS.length; i++) {
        const account = ACCOUNTS[i];
        const ipfsHash = IPFS_HASHES[i];

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
    console.error(error);
    process.exitCode = 1;
});
