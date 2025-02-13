import { BrowserProvider, Contract, JsonRpcSigner, ethers } from 'ethers';
import { CONTRACT_ADDRESS, WALLETCONNECT_PROJECT_KEY } from '@env';

import HealthInfoABI from '../abi/HealthInfoABI.json';
import WalletConnectProvider from "@walletconnect/ethereum-provider";

// Validate environment variables
if (!CONTRACT_ADDRESS) {
  throw new Error(
    'CONTRACT_ADDRESS is not defined in the environment variables.'
  );
}

let provider: BrowserProvider | null = null;
let signer: JsonRpcSigner | null = null;
let contract: Contract | null = null;

export async function connectWallet(): Promise<void> {
  if (provider && contract) return; 

  const projectId = WALLETCONNECT_PROJECT_KEY

  console.log(`Connecting to project ${projectId}`)
  console.log(`Connecting to contract ${CONTRACT_ADDRESS}`)

  const walletConnectProvider = await WalletConnectProvider.init({
  projectId: WALLETCONNECT_PROJECT_KEY,
  chains: [1], 
  showQrModal: true,
  });

  await walletConnectProvider.enable();

  provider = new BrowserProvider(walletConnectProvider);
  signer = await provider.getSigner();

  contract = new Contract(CONTRACT_ADDRESS, HealthInfoABI, signer);
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
  console.log('Health record updated successfully.');
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
      'Contract not initialized. Make sure to call connectWallet() first.'
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
      'Contract not initialized. Make sure to connectWallet() first.'
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
      'Contract not initialized. Make sure to call connectWallet() first.'
    );
  }
  try {
    console.log("🔍 Fetching health record for:", ownerAddress);
    const result = await contract.getHealthRecord(ownerAddress);
    console.log("✅ Raw contract response:", result);

    if (!result || result === "0x") {
      console.warn(`⚠️ No health record found for: ${ownerAddress}`);
      return "No data available";
    }

    return result;
  } catch (error) {
    console.error("❌ Error fetching health record from contract:", error);
    throw error;
  }
}

export async function getOwnHealthRecordHash(): Promise<string> {
  if (!contract || !signer) {
    throw new Error(
      'Contract not initialized. Make sure to call connectWallet() first.'
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
      'Contract not initialized. Make sure to call connectWallet() first.'
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
  if (!contract || !signer) {
    throw new Error(
      '🚨 Contract or signer not initialized. Call `connectWallet()` first.'
    );
  }

  console.log('🔄 Sending requestAccess transaction...');

  try {
    const tx = await contract.requestAccess(recordOwner, note);
    await tx.wait(); // Wait for confirmation
    console.log(
      `✅ Access requested from ${await signer.address} to ${recordOwner}`
    );
  } catch (error) {
    console.error('🚨 Error in requestAccess transaction:', error);
    throw error;
  }
}

/**
 * Approve an access request from a user.
 * @param requester - The address of the user requesting access.
 */
export async function approveAccessRequest(requester: string): Promise<void> {
  const tx = await (
    contract!.connect(signer!) as Contract
  ).approveAccessRequest(requester);
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
export async function getAccessRequests(): Promise<string[]> {
  if (!contract || !signer) {
    throw new Error(
      'Contract not initialized. Make sure to call connectWallet() first.'
    );
  }
  return await contract.getAccessRequests();
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
      'Contract not initialized. Make sure to call connectWallet() first.'
    );
  }
  const [addresses, timestamps, descriptions] = await contract.getUpdates();
  return { addresses, timestamps, descriptions };
}
