import { BrowserProvider, Contract, JsonRpcSigner, ethers } from "ethers";

import { CONTRACT_ADDRESS } from "@env";
import HealthInfoABI from "../abi/HealthInfoABI.json";

// Validate environment variables
if (!CONTRACT_ADDRESS) {
  throw new Error(
    "CONTRACT_ADDRESS is not defined in the environment variables."
  );
}

let provider: BrowserProvider | null = null;
let signer: JsonRpcSigner | null = null;
let contract: Contract | null = null;

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet(): Promise<void> {
  if (!window.ethereum) throw new Error("MetaMask not installed.");

  if (provider && contract) return; // ✅ Prevents re-initialization

  provider = new BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []); // Request access to MetaMask
  signer = await provider.getSigner();

  contract = new Contract(CONTRACT_ADDRESS, HealthInfoABI.abi, signer);
}

/**
 * Add or update a health record with an IPFS hash.
 * @param ipfsHash - The IPFS hash of the health record.
 */
export async function updateHealthRecord(
  owner: string,
  newIpfsHash: string
): Promise<void> {
  const tx = await (contract!.connect(signer!) as Contract).updateHealthRecord(
    owner,
    newIpfsHash
  );
  await tx.wait();
  console.log("Health record updated successfully.");
}

/**
 * Check if access is requested for a specific owner by a requester.
 * @param owner - The Ethereum address of the health record owner.
 * @returns - A boolean indicating whether access is requested.
 */
export async function hasRequestedAccess(owner: string): Promise<boolean> {
  if (!ethers.isAddress(owner)) {
    throw new Error(`Invalid Ethereum address: ${owner}`);
  }
  if (!contract || !signer) {
    throw new Error(
      "Contract not initialized. Make sure to call connectWallet() first."
    );
  }
  try {
    const result = await contract.hasRequestedAccess(owner);
    return result;
  } catch (error) {
    console.error(`Error checking access request: ${error}`);
    throw error;
  }
}

/**
 * Check if access is requested for a specific owner by a requester.
 * @param owner - The Ethereum address of the health record owner.
 * @returns - A boolean indicating whether access is requested.
 */
export async function hasAccess(owner: string): Promise<boolean> {
  if (!ethers.isAddress(owner)) {
    throw new Error(`Invalid Ethereum address: ${owner}`);
  }
  if (!contract)
    throw new Error(
      "Contract not initialized. Make sure to connectWallet() first."
    );

  try {
    const result = await contract.hasAccess(owner);
    return result;
  } catch (error) {
    console.error(`Error checking access request: ${error}`);
    throw error;
  }
}

/**
 * Fetch the health record IPFS hash for a given owner address.
 * @param ownerAddress - The Ethereum address of the owner.
 * @returns - The IPFS hash as a string.
 */
export async function getHealthRecordHash(
  ownerAddress: string
): Promise<string> {
  if (!ethers.isAddress(ownerAddress)) {
    throw new Error(`Invalid Ethereum address: ${ownerAddress}`);
  }
  if (!contract || !signer) {
    throw new Error(
      "Contract not initialized. Make sure to call connectWallet() first."
    );
  }
  return await contract.getHealthRecord(ownerAddress);
}

export async function getOwnHealthRecordHash(): Promise<string> {
  if (!contract || !signer) {
    throw new Error(
      "Contract not initialized. Make sure to call connectWallet() first."
    );
  }
  return await contract.getOwnHealthRecord();
}

/**
 * Fetch the list of addresses with access to the owner's health record.
 * @param ownerAddress - The Ethereum address of the owner.
 * @returns - An array of addresses.
 */
export async function getAccessList(): Promise<string[]> {
  if (!contract || !signer) {
    throw new Error(
      "Contract not initialized. Make sure to call connectWallet() first."
    );
  }
  return await contract.getAccessList();
}

/**
 * Grant access to another user.
 * @param permissionedUser - The address of the user to grant access to.
 */
export async function grantAccess(permissionedUser: string): Promise<void> {
  const tx = await (contract!.connect(signer!) as Contract).grantAccess(
    permissionedUser
  );
  await tx.wait();
  console.log(`Access granted to ${permissionedUser}`);
}

/**
 * Revoke access from another user.
 * @param permissionedUser - The address of the user to revoke access from.
 */
export async function revokeAccess(permissionedUser: string): Promise<void> {
  const tx = await (contract!.connect(signer!) as Contract).revokeAccess(
    permissionedUser
  );
  await tx.wait();
  console.log(`Access revoked from ${permissionedUser}`);
}

/**
 * Request access to another user's health record.
 * @param recordOwner - The address of the health record owner.
 */
export async function requestAccess(
  recordOwner: string,
  note: string
): Promise<void> {
  const tx = await (contract!.connect(signer!) as Contract).requestAccess(
    recordOwner,
    note
  );
  await tx.wait();
  console.log(`Access requested from ${signer!.address} to ${recordOwner}`);
}

/**
 * Deny an access request from a user.
 * @param requester - The address of the user requesting access.
 */
export async function denyAccessRequest(requester: string): Promise<void> {
  if (!ethers.isAddress(requester)) {
    throw new Error(`Invalid Ethereum address: ${requester}`);
  }

  const tx = await (contract!.connect(signer!) as Contract).denyAccessRequest(
    requester
  );
  await tx.wait();
  console.log(`Access request from ${requester} denied.`);
}

/**
 * Fetch the list of addresses with access to the owner's health record.
 * @param ownerAddress - The Ethereum address of the owner.
 * @returns - An array of addresses.
 */
export async function getAccessRequests(): Promise<{
  addresses: string[];
  notes: string[];
}> {
  if (!contract || !signer) {
    throw new Error(
      "Contract not initialized. Make sure to call connectWallet() first."
    );
  }
  const [addresses, notes] = await contract.getAccessRequests();
  return { addresses, notes };
}
/**
 * Get updates for a health record, including the addresses and timestamps.
 * @param recordOwner - The address of the record owner.
 * @returns - An object containing arrays of addresses and timestamps.
 */
export async function getUpdates(): Promise<{
  addresses: string[];
  timestamps: number[];
  descriptions: string[];
}> {
  if (!contract || !signer) {
    throw new Error(
      "Contract not initialized. Make sure to call connectWallet() first."
    );
  }
  const [addresses, timestamps, descriptions] = await contract.getUpdates();
  return { addresses, timestamps, descriptions };
}
