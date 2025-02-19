import { CONTRACT_ADDRESS, INFURA_API_KEY, METAMASK_PRIVATE_KEY } from '@env';
import { Contract, JsonRpcProvider, ethers, getIcapAddress } from 'ethers';

import HealthInfoABI from '../abi/HealthRecordsABI.json';

if (!CONTRACT_ADDRESS) {
  throw new Error('CONTRACT_ADDRESS is missing in .env.');
}

if (!METAMASK_PRIVATE_KEY) {
  throw new Error('METAMASK_PRIVATE_KEY is missing in .env.');
}

if (!INFURA_API_KEY) {
  throw new Error('INFURA_API_KEY is missing in .env.');
}

/**
 * Connect to contract through Metamask.
 */
const provider = new JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_API_KEY}`
);
const signer = new ethers.Wallet(METAMASK_PRIVATE_KEY, provider);

const getContract = (): Contract => {
  return new Contract(CONTRACT_ADDRESS, HealthInfoABI, signer);
};

/**
 * Update a health record on the blockchain with new ipfshash
 * @param owner - Owner of the health record.
 * @param newIpfsHash - The new IPFS hash of the health record.
 */
export async function updateHealthRecord(
  owner: string,
  newIpfsHash: string
): Promise<void> {
  if (!ethers.isAddress(owner)) {
    throw new Error(`Invalid Ethereum address: ${owner}`);
  }
  const tx = await getContract().updateHealthRecord(owner, newIpfsHash);
  await tx.wait();
  console.log('Health record updated successfully.');
}

/**
 * Check if access is requested for a specific owner.
 * @param owner - The address of the health record owner.
 * @returns - A boolean indicating whether access is requested.
 */
export async function hasRequestedAccess(owner: string): Promise<boolean> {
  if (!ethers.isAddress(owner)) {
    throw new Error(`Invalid Ethereum address: ${owner}`);
  }
  return await getContract().hasRequestedAccess(owner);
}

/**
 * Check if access is granted from a specific owner.
 * @param owner - The Ethereum address of the health record owner.
 * @returns - A boolean indicating whether access is given.
 */
export async function hasAccess(owner: string): Promise<boolean> {
  if (!ethers.isAddress(owner)) {
    throw new Error(`Invalid Ethereum address: ${owner}`);
  }
  return await getContract().hasAccess(owner);
}

/**
 * Fetch the health record IPFS hash for a given owner address.
 * @param owner - The Ethereum address of the owner.
 * @returns - The IPFS hash of the health record.
 */
export async function getHealthRecordHash(owner: string): Promise<string> {
  if (!ethers.isAddress(owner)) {
    throw new Error(`Invalid Ethereum address: ${owner}`);
  }
  return await getContract().getHealthRecord(owner);
}

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
 * Request access to another user's health record.
 * @param owner - The address of the health record owner.
 * @param note - The note to send with the request.
 */
export async function requestAccess(
  owner: string,
  note: string
): Promise<void> {
  if (!ethers.isAddress(owner)) {
    throw new Error(`Invalid Ethereum address: ${owner}`);
  }

  console.log('Sending requestAccess transaction...');
  const tx = await getContract().requestAccess(owner, note);
  await tx.wait();
  console.log(`Access requested from ${await signer.address} to ${owner}`);
}

/**
 * Approve an access request from a user.
 * @param requester - The address of the user requesting access.
 */
export async function approveAccessRequest(requester: string): Promise<void> {
  if (!ethers.isAddress(requester)) {
    throw new Error(`Invalid Ethereum address: ${requester}`);
  }
  const tx = await getContract().approveAccessRequest(requester);
  await tx.wait();
  console.log(`Access request from ${requester} approved.`);
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