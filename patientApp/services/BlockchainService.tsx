import { CONTRACT_ADDRESS, INFURA_API_KEY, METAMASK_PRIVATE_KEY, TEST_ADDRESS } from "@env";
import { Contract, JsonRpcProvider, ethers } from "ethers";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EthrDID } from "ethr-did";
import { createVerifiableCredentialJwt } from "did-jwt-vc";

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

const DID_STORAGE_KEY = "user_did"; // Key for AsyncStorage
const DEFAULT_ROLE = "patient"; 
/**
 * Connect to contract through Metamask.
 */
const provider = new JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
);
const signer = new ethers.Wallet(METAMASK_PRIVATE_KEY, provider);

//const provider = new JsonRpcProvider("http://127.0.0.1:8545");

const getContract = (): Contract => {
  console.log("Contract address: ", CONTRACT_ADDRESS);
  return new Contract(CONTRACT_ADDRESS, HealthInfoABI, provider);
};


/**
 * Generates a new DID if one doesn't exist in storage.
 * @returns The stored or newly created DID document.
 */
export async function getOrCreateDID(role = DEFAULT_ROLE): Promise<{ did: string; privateKey: string; role: string }> {
  const storedDID = await AsyncStorage.getItem(DID_STORAGE_KEY);
  if (storedDID) {
    console.log("Existing DID retrieved:", storedDID);
    return JSON.parse(storedDID); // Return the existing DID
  }

  const contract = getContract();
  const onChainDID = await contract.getDID(signer.address);
  if (onChainDID) {
    await AsyncStorage.setItem(DID_STORAGE_KEY, JSON.stringify({ did: onChainDID, role }));
    return onChainDID;
  }

  const wallet = ethers.Wallet.createRandom();
  const privateKey = wallet.privateKey;
  const address = wallet.address;

  const didInstance = new EthrDID({
    identifier: address,
    privateKey,
    provider,
    chainNameOrId: "sepolia", //vet ikke om dette må være med
  });

  const didDocument = {
    did: didInstance.did,
    privateKey,
    role,
  };

  await AsyncStorage.setItem(DID_STORAGE_KEY, JSON.stringify(didDocument));
  console.log("henter item" , AsyncStorage.getItem(DID_STORAGE_KEY));
  console.log("New DID created and stored:", didDocument.did);

  return didDocument;
}

/**
 * Registers the DID on the blockchain if it hasn't been registered already.
 */
export async function registerDIDOnBlockchain(role = DEFAULT_ROLE): Promise<void> {
  const { did } = await getOrCreateDID(role); // Retrieve or create the DID
  const contract = getContract();
  
  try {
    // Check if the DID is already registered on the blockchain
    const isRegistered = await contract.verifyDID(signer.address);
    console.log("address: ", signer.address);
    if (isRegistered) {
      console.log("DID is already registered on the blockchain:", did);
      return;
    }
    
    // Register the DID on the blockchain
    const tx = await contract.setDID(did, role);
    await tx.wait();
    console.log(`DID registered on blockchain: ${did} with role ${role}`);
  } catch (error) {
    console.error("Error registering DID on blockchain:", error);
  }
}

// export async function createPatientVC(subjectDID: string, claims: any, issuerPrivateKey: string): Promise<string> {
//   const issuanceDate = new Date().toISOString();

//   // VC Payload
//   const vcPayload = {
//       "@context": ["https://www.w3.org/2018/credentials/v1"],
//       "type": ["VerifiableCredential", "PatientCredential"],
//       "issuer": { "id": "did:ethr:issuerDID" },  // Replace with actual issuer DID
//       "issuanceDate": issuanceDate,
//       "credentialSubject": {
//           "id": subjectDID,
//           "medicalInfo": claims
//       }
//   };

//   // Sign the VC using the issuer's private key
//   const signer = ethers.Wallet.fromEncryptedJson(issuerPrivateKey, "password");
//   const jwt = await createVerifiableCredentialJwt(vcPayload, { signer });

//   console.log("Generated Patient VC:", jwt);
//   return jwt;
// }


// export async function registerDIDOnBlockchain(): Promise<void> {
//   const { did } = await getOrCreateDID(); // Get or create the DID
//   const contract = getContract();

//   try {
//     const tx = await contract.setDID(did);  // Correct contract method name
//     await tx.wait();
//     console.log(`DID registered on blockchain: ${did}`);
//   } catch (error) {
//     console.error("Error registering DID on blockchain:", error);
//   }
// }

/**
 * Fetch the health record IPFS hash for the requester.
 * @returns - The IPFS hash of the health record.
 */
export async function getOwnHealthRecordHash(): Promise<string> {
  const didData = await getOrCreateDID();
  console.log("Using DID:", didData.did);

  const hash = await getContract().getOwnHealthRecord(didData.did);
  console.log("Health record hash:", hash);
  return await getContract().getOwnHealthRecord(hash);
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