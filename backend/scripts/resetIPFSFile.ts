import { Contract, JsonRpcProvider, parseUnits } from "ethers";

import dotenv from "dotenv";
import { ethers } from "hardhat";

dotenv.config();

async function main() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const IPFS_HASH = process.env.IPFS_HASH;
    const PATIENT_ADDRESS = process.env.PATIENT_ADDRESS;
    const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY
    const INFURA_API_KEY = process.env.INFURA_API_KEY

    if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS is not defined");
    if (!METAMASK_PRIVATE_KEY) throw new Error("METAMASK_PRIVATE_KEY is not defined");
    if (!INFURA_API_KEY) throw new Error("INFURA_API_KEY is not defined");

  
    const provider = new JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
      
    const signer = new ethers.Wallet(METAMASK_PRIVATE_KEY, provider);
    
    console.log('Connected as:', signer.address);

    const HealthInfoFactory = await ethers.getContractFactory("HealthRecords");
    const contract = HealthInfoFactory.attach(CONTRACT_ADDRESS).connect(signer);

    try {
        const tx = await (contract!.connect(signer!) as Contract).updatePatientRecord(PATIENT_ADDRESS, IPFS_HASH, "Record reset", {
            gasLimit: 500000,
            gasPrice: parseUnits("10", "gwei"), 
        });
        console.log("Transaction sent! Hash:", tx.hash);
        console.log("Waiting for transaction confirmation...");
        await tx.wait();
        console.log(`${PATIENT_ADDRESS} is set as owner for file: ${IPFS_HASH}`);
    } catch (error) {
        console.error(`Failed to set owner for file: ${IPFS_HASH}`, error);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
