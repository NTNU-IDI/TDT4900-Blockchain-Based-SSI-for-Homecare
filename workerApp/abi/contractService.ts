import { Contract, ethers } from "ethers";

import HealthInfoABI from "./HealthInfoABI.json";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Load environment variables
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;

// Validate environment variables
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
 * Add or update a health record with an IPFS hash.
 * @param ipfsHash - The IPFS hash of the health record.
 * @param privateKey - The private key of the sender.
 */
export async function updateHealthRecord(ipfsHash: string, privateKey: string): Promise<void> {
    const signer = new ethers.Wallet(privateKey, provider);
    //const contractWithSigner = contract.connect(signer);

    const tx = await (contract!.connect(signer!) as Contract).addOrUpdateHealthRecord(ipfsHash);
    await tx.wait();
    console.log("Health record updated successfully.");
}

/**
 * Fetch the health record IPFS hash for a given owner address.
 * @param ownerAddress - The Ethereum address of the owner.
 * @returns - The IPFS hash as a string.
 */
export async function getHealthRecordHash(ownerAddress: string): Promise<string> {
    if (!ethers.isAddress(ownerAddress)) {
        throw new Error(`Invalid Ethereum address: ${ownerAddress}`);
    }
    return await contract.getHealthRecord(ownerAddress);
}

/**
 * Fetch the list of addresses with access to the owner's health record.
 * @param ownerAddress - The Ethereum address of the owner.
 * @returns - An array of addresses.
 */
export async function getAccessList(ownerAddress: string): Promise<string[]> {
    if (!ethers.isAddress(ownerAddress)) {
        throw new Error(`Invalid Ethereum address: ${ownerAddress}`);
    }
    return await contract.getAccessList(ownerAddress);
}

/**
 * Grant access to another user.
 * @param permissionedUser - The address of the user to grant access to.
 * @param privateKey - The private key of the sender.
 */
export async function grantAccess(permissionedUser: string, privateKey: string): Promise<void> {
    const signer = new ethers.Wallet(privateKey, provider);
    //const contractWithSigner = contract.connect(signer);

    const tx = await (contract!.connect(signer!) as Contract).grantAccess(permissionedUser);
    await tx.wait();
    console.log(`Access granted to ${permissionedUser}`);
}

/**
 * Revoke access from another user.
 * @param permissionedUser - The address of the user to revoke access from.
 * @param privateKey - The private key of the sender.
 */
export async function revokeAccess(permissionedUser: string, privateKey: string): Promise<void> {
    const signer = new ethers.Wallet(privateKey, provider);
    //const contractWithSigner = contract.connect(signer);

    const tx = await (contract!.connect(signer!) as Contract).revokeAccess(permissionedUser);
    await tx.wait();
    console.log(`Access revoked from ${permissionedUser}`);
}

/**
 * Get updates for a health record, including the addresses and timestamps.
 * @param recordOwner - The address of the record owner.
 * @returns - An object containing arrays of addresses and timestamps.
 */
export async function getUpdates(recordOwner: string): Promise<{ addresses: string[]; timestamps: number[] }> {
    if (!ethers.isAddress(recordOwner)) {
        throw new Error(`Invalid Ethereum address: ${recordOwner}`);
    }
    const [addresses, timestamps] = await contract.getUpdates(recordOwner);
    return { addresses, timestamps };
}
