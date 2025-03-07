import AsyncStorage from "@react-native-async-storage/async-storage";
import { EthrDID } from "ethr-did";
import { Resolver } from "did-resolver";
import { getResolver } from "ethr-did-resolver";
import { ethers, JsonRpcProvider } from "ethers";
import { CONTRACT_ADDRESS, INFURA_API_KEY } from "@env";
import HealthInfoABI from "../abi/HealthRecordsABI.json";


const DID_STORAGE_KEY = "user_did"; // Key for AsyncStorage

// Infura & registry settings for Sepolia
const providerConfig = {
  rpcUrl: `https://sepolia.infura.io/v3/YOUR_INFURA_API_KEY`,
  registry: "0x03d5003bf0e79c5f5223588f347eba39afbc3818", //"0xdca7ef03e98e0dc2b855be647c39abe984fcf21b",
  chainId: 11155111,
};

const provider = new JsonRpcProvider(
  `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
);

/**
 * Generates a new DID if one doesn't exist in storage.
 * @returns The stored or newly created DID document.
 */
export async function getOrCreateDID(): Promise<{ did: string; privateKey: string }> {
  // Check if DID exists in AsyncStorage
  const storedDID = await AsyncStorage.getItem(DID_STORAGE_KEY);
  if (storedDID) {
    return JSON.parse(storedDID); // Return the existing DID
  }

  // Generate a new Ethereum key pair
  const wallet = ethers.Wallet.createRandom();
  const privateKey = wallet.privateKey;
  const address = wallet.address;

  // Create a new EthrDID instance
  const didInstance = new EthrDID({
    identifier: address,
    privateKey,
    provider,
    chainNameOrId: "sepolia", //vet ikke om dette må være med
  });

  const didDocument = {
    did: didInstance.did,
    privateKey,
  };

  // Store DID document in AsyncStorage
  await AsyncStorage.setItem(DID_STORAGE_KEY, JSON.stringify(didDocument));

  console.log("New DID created and stored:", didDocument.did);


  // Sign the DID and send it to the backend

  return didDocument;
}

async function signChallengeWithDID(did: string, privateKey: string): Promise<string> {
    const signer = new ethers.Wallet(privateKey);
    const message = `Please sign this message to prove ownership of DID: ${did}`;
  
    // Sign the message
    const signature = await signer.signMessage(message);
    return signature;
  }
  
  // Send the signed challenge to the smart contract for verification
  async function verifyDID(did: string, privateKey: string, contractAddress: string) {
    const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/YOUR_INFURA_KEY");
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(contractAddress, HealthInfoABI, signer);
  
    // Sign the challenge
    const signature = await signChallengeWithDID(did, privateKey);
  
    // Generate the challenge message
    const message = `Please sign this message to prove ownership of DID: ${did}`;
  
    // Call the contract to verify the signature
    const isValid = await contract.verifySignature(did, message, signature);
    if (isValid) {
      console.log("DID verification successful");
      // Proceed with interaction with contract (e.g., health record actions)
    } else {
      console.log("DID verification failed");
    }
}

export async function interactWithContract() {
    // Retrieve the stored DID and private key from AsyncStorage
    const didDocument = await getOrCreateDID();
    const { did, privateKey } = didDocument;
  
  
    // Verify DID before proceeding with contract interaction
    await verifyDID(did, privateKey, CONTRACT_ADDRESS);
  
    // Proceed with further contract interactions if verification is successful
  }


/**
 * Resolves the DID document.
 * @param did - The DID to resolve.
 * @returns The resolved DID document.
 */
export async function resolveDID(did: string): Promise<any> {
  const resolver = new Resolver(getResolver(providerConfig));
  return await resolver.resolve(did);
}
