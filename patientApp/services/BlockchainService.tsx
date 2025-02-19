import { CONTRACT_ADDRESS, INFURA_API_KEY, METAMASK_PRIVATE_KEY } from "@env";
import { Contract, JsonRpcProvider, ethers } from "ethers";

import HealthInfoABI from "../abi/HealthRecordsABI.json";

if (!CONTRACT_ADDRESS) {
  throw new Error("CONTRACT_ADDRESS is missing in .env.");
}

if (!METAMASK_PRIVATE_KEY) {
  throw new Error("METAMASK_PRIVATE_KEY is missing in .env.");
}

if (!INFURA_API_KEY) {
  throw new Error("INFURA_API_KEY is missing in .env.");
}

/**
 * Connect to contract through Metamask.
 */
const provider = new JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
);
const signer = new ethers.Wallet(METAMASK_PRIVATE_KEY, provider);

const getContract = (): Contract => {
  return new Contract(CONTRACT_ADDRESS, HealthInfoABI, signer);
};

/**
 * Fetch the health record IPFS hash for the requester.
 * @returns - The IPFS hash of the health record.
 */
export async function getOwnHealthRecordHash(): Promise<string> {
  return await getContract().getOwnHealthRecord();
}

/**
 * Fetch the list of addresses with access to the requester's health record.
 * @returns - An array of addresses.
 */
export async function getAccessList(): Promise<string[]> {
  return await getContract().getAccessList();
}

/**
 * Grant access to another user.
 * @param requester - The address of the user to grant access to.
 */
export async function grantAccess(requester: string): Promise<void> {
  if (!ethers.isAddress(requester)) {
    throw new Error(`Invalid Ethereum address: ${requester}`);
  }
  const tx = await getContract().grantAccess(requester);
  await tx.wait();
  console.log(`Access granted to ${requester}`);
}

/**
 * Revoke access from another user.
 * @param requester - The address of the user to revoke access from.
 */
export async function revokeAccess(requester: string): Promise<void> {
  if (!ethers.isAddress(requester)) {
    throw new Error(`Invalid Ethereum address: ${requester}`);
  }
  const tx = await getContract().revokeAccess(requester);
  await tx.wait();
  console.log(`Access revoked from ${requester}`);
}

/**
 * Deny an access request from a user.
 * @param requester - The address of the user requesting access.
 */
export async function denyAccessRequest(requester: string): Promise<void> {
  if (!ethers.isAddress(requester)) {
    throw new Error(`Invalid Ethereum address: ${requester}`);
  }

  const tx = await getContract().denyAccessRequest(requester);
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
  const [addresses, notes] = await getContract().getAccessRequests();
  return { addresses, notes };
}
/**
 * Get the requester's health record updates, including the addresses, timestamps and descriptions.
 * @returns - An object containing arrays of addresses, timestamps and descriptions of the updates.
 */
export async function getUpdates(): Promise<{
  addresses: string[];
  timestamps: number[];
  descriptions: string[];
}> {
  const [addresses, timestamps, descriptions] =
    await getContract().getUpdates();
  return { addresses, timestamps, descriptions };
}
