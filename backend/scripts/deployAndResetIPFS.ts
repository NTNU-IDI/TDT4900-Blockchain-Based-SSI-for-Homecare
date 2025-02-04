import { Contract } from "ethers";
import axios from "axios";
import dotenv from "dotenv";
import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

dotenv.config();

interface PinataResponse {
    IpfsHash: string;
    PinSize: number;
    Timestamp: string;
  }

export const uploadToIPFS = async (
    data: Record<string, unknown>,
    filename: string
  ): Promise<string> => {
    try {
      const response = await axios.post<PinataResponse>(
        'https://api.pinata.cloud/pinning/pinJSONToIPFS',
        {
          pinataContent: data,
          pinataMetadata: {
            name: filename
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            pinata_api_key: process.env.PINATA_API_KEY,
            pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY
          }
        }
      );
  
      console.log('Successfully uploaded to IPFS:', response.data.IpfsHash);
      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading data to IPFS:', error);
      throw error;
    }
  };


async function deployContract(): Promise<string> {
    console.log("Deploying contract...");
    const HealthInfo = await ethers.getContractFactory("HealthInfo");
    const healthInfo = await HealthInfo.deploy();
    await healthInfo.waitForDeployment();
    const contractAddress = await healthInfo.getAddress();
    console.log("Contract deployed to:", contractAddress);

    fs.writeFileSync(".env", `CONTRACT_ADDRESS=${contractAddress}\n`);
    return contractAddress;
}

async function main() {
    const contractAddress = await deployContract();
    const ACCOUNTS = process.env.ACCOUNTS?.split(",") || [];
    if (ACCOUNTS.length === 0) throw new Error("No accounts provided in .env file.");

    const jsonFolderPath = path.join(__dirname, "../jsons");
    if (!fs.existsSync(jsonFolderPath)) {
        throw new Error("JSON folder not found: " + jsonFolderPath);
    }

    const jsonFiles = fs.readdirSync(jsonFolderPath).filter(file => file.endsWith(".json"));
    if (jsonFiles.length !== ACCOUNTS.length) {
        throw new Error("Mismatch: The number of JSON files and accounts must be the same.");
    }

    const ipfsHashes: string[] = [];
    for (const file of jsonFiles) {
        console.log(`Uploading ${file} to IPFS...`);
        const filePath = path.join(jsonFolderPath, file);
        const rawData = fs.readFileSync(filePath);
        const data = JSON.parse(rawData.toString());
        const filename = `${data.name.replace(/\s+/g, '')}.json`;
        const hash = await uploadToIPFS(data, filename);
        console.log(`Uploaded ${file} with IPFS hash: ${hash}`);
        ipfsHashes.push(hash);
    }

     // Get signer
     const [signer] = await ethers.getSigners();
     //console.log("Using signer:", await signer.getAddress());
 
     // Attach to deployed contract
     const HealthInfoFactory = await ethers.getContractFactory("HealthInfo");
     const contract = HealthInfoFactory.attach(contractAddress).connect(signer);

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
