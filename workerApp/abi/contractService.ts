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
export async function getAccessList(): Promise<string[]> {
    return await contract.getAccessList();
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
 * Request access to another user's health record.
 * @param recordOwner - The address of the health record owner.
 * @param privateKey - The private key of the requester.
 */
export async function requestAccess(recordOwner: string, privateKey: string): Promise<void> {
    const signer = new ethers.Wallet(privateKey, provider);

    const tx = await (contract!.connect(signer!) as Contract).requestAccess(recordOwner);
    await tx.wait();
    console.log(`Access requested from ${recordOwner}`);
}

/**
 * Approve an access request from a user.
 * @param requester - The address of the user requesting access.
 * @param privateKey - The private key of the record owner.
 */
export async function approveAccessRequest(requester: string, privateKey: string): Promise<void> {
    const signer = new ethers.Wallet(privateKey, provider);

    const tx = await (contract!.connect(signer!) as Contract).approveAccessRequest(requester);
    await tx.wait();
    console.log(`Access request from ${requester} approved.`);
}

/**
 * Deny an access request from a user.
 * @param requester - The address of the user requesting access.
 * @param privateKey - The private key of the record owner.
 */
export async function denyAccessRequest(requester: string, privateKey: string): Promise<void> {
    const signer = new ethers.Wallet(privateKey, provider);

    if (!ethers.isAddress(requester)) {
        throw new Error(`Invalid Ethereum address: ${requester}`);
    }

    const tx = await (contract!.connect(signer!) as Contract).denyAccessRequest(requester);
    await tx.wait();
    console.log(`Access request from ${requester} denied.`);
}

/**
 * Fetch the list of addresses with access to the owner's health record.
 * @param ownerAddress - The Ethereum address of the owner.
 * @returns - An array of addresses.
 */
export async function getAccessRequests(): Promise<string[]> {
    return await contract.getAccessRequests();
}
/**
 * Get updates for a health record, including the addresses and timestamps.
 * @param recordOwner - The address of the record owner.
 * @returns - An object containing arrays of addresses and timestamps.
 */
export async function getUpdates(): Promise<{ addresses: string[]; timestamps: number[] }> {
    const [addresses, timestamps] = await contract.getUpdates();
    return { addresses, timestamps };
}
