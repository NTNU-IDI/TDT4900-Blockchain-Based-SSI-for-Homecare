/**
 * This script reads JSON files from the `jsons` folder, uploads them to IPFS via Pinata, and sets the owner of the IPFS hash to an Ethereum patient address in the smart contract.
 * **/
import { Contract, JsonRpcProvider } from "ethers";

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

async function main() {
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
    const METAMASK_PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY
    const INFURA_API_KEY = process.env.INFURA_API_KEY
    const PATIENT_ADDRESSES = process.env.PATIENT_ADDRESSES ? process.env.PATIENT_ADDRESSES.split(",") : [];
    const PATIENT_DIDS = process.env.PATIENT_DIDS ? process.env.PATIENT_DIDS.split(",") : [];

    
    if (!CONTRACT_ADDRESS) {
        throw new Error("CONTRACT_ADDRESS is not defined in .env");
    }
    if (!METAMASK_PRIVATE_KEY) {
        throw new Error("METAMASK_PRIVATE_KEY is not defined in .env");
    }
    if (!INFURA_API_KEY) {
        throw new Error("INFURA_API_KEY is not defined in .env");
    }
    // if (PATIENT_ADDRESSES.length === 0) {
    //     throw new Error("PATIENT_ADDRESSES are not defined in .env");
    // }
    if (PATIENT_DIDS.length === 0) {
      throw new Error("PATIENT_DIDS are not defined in .env");
  }
  
    
    //const provider = new JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
    const provider = new JsonRpcProvider("http://127.0.0.1:8545");

    // const accounts = await ethers.getSigners();
    // const signer = accounts[0]; // Use the first pre-funded account
    // console.log("Signer address:", signer.address);

    const signer = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", provider);
    console.log(CONTRACT_ADDRESS)

    //const signer = new ethers.Wallet(METAMASK_PRIVATE_KEY, provider);
    const HealthInfoFactory = await ethers.getContractFactory("HealthRecords");
    const contract = HealthInfoFactory.attach(CONTRACT_ADDRESS).connect(signer);
    
    

    const signerDID = PATIENT_DIDS[0]; // Assuming the first DID is for the signer
    const role = "patient"; // or any other role you want to assign

    console.log(`Setting DID for signer: ${signerDID}`);
    try {
        const tx = await (contract!.connect(signer!) as Contract).setDID(signerDID, role);
        await tx.wait();
        console.log(`DID set for signer: ${signer.address} ${signerDID}`);
    } catch (error) {
        console.error(`Failed to set DID for signer: ${signerDID}`, error);
        return;
    }


    const jsonFolderPath = path.join(__dirname, "../jsons");    
    if (!fs.existsSync(jsonFolderPath)) {
        throw new Error("JSON folder not found: " + jsonFolderPath);
    }

    const jsonFiles = fs.readdirSync(jsonFolderPath).filter(file => file.endsWith(".json"));
    if (jsonFiles.length !== PATIENT_ADDRESSES.length) {
        throw new Error("Mismatch: The number of JSON files and patient addresses must be the same.");
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

    // for (let i = 0; i < PATIENT_ADDRESSES.length; i++) {
    //     const patient = PATIENT_ADDRESSES[i];
    //     const ipfsHash = ipfsHashes[i];

    //     console.log(`Setting owner for IPFS hash: ${ipfsHash} to account: ${patient}`);
    //     try {
    //         const tx = await (contract!.connect(signer!) as Contract).initializePatientRecord(patient, ipfsHash);
    //         console.log("Waiting for transaction confirmation...");
    //         await tx.wait();
    //         console.log(`Owner set for ipfshash: ${ipfsHash}`);
    //     } catch (error) {
    //         console.error(`Failed to set owner for ipfshash: ${ipfsHash}`, error);
    //     }
    // }

      for (let i = 0; i < PATIENT_DIDS.length; i++) {
          const patientDID = PATIENT_DIDS[i];
          const ipfsHash = ipfsHashes[i];

          console.log(`Setting owner for IPFS hash: ${ipfsHash} to DID: ${patientDID}`);
          try {
              const tx = await (contract!.connect(signer!) as Contract).initializePatientRecord(patientDID, ipfsHash);
              console.log("Waiting for transaction confirmation...");
              await tx.wait();
              console.log(`Owner set for ipfsHash: ${ipfsHash}`);
          } catch (error) {
              console.error(`Failed to set owner for ipfsHash: ${ipfsHash}`, error);
          }
    }
    
}

main().catch((error) => {
    console.error("Error:", error);
    process.exit(1);
});
