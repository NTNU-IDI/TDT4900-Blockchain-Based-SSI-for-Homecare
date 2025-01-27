import HealthInfoABI from "./HealthInfoABI.json";
import dotenv from "dotenv";
import { ethers } from "ethers";

dotenv.config({path:"../.env"});

// Load environment variables
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;

// Validate CONTRACT_ADDRESS and RPC_URL
if (!CONTRACT_ADDRESS) {
    throw new Error("CONTRACT_ADDRESS is not defined in the environment variables.");
}
if (!RPC_URL) {
    throw new Error("RPC_URL is not defined in the environment variables.");
}

// Initialize the provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Create the contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, HealthInfoABI.abi, provider);

/**
 * Fetch the health record IPFS hash for a given owner address.
 * @param ownerAddress - The Ethereum address of the owner.
 * @returns - The IPFS hash as a string.
 */
export default async function getHealthRecordHash(ownerAddress: string): Promise<string> {
    if (!ethers.isAddress(ownerAddress)) {
        throw new Error(`Invalid Ethereum address: ${ownerAddress}`);
    }

    // Interact with the contract to fetch the IPFS hash
    return await contract.getHealthRecord(ownerAddress);
}
