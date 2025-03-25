import { Contract, JsonRpcProvider } from "ethers";
import { ethers } from "hardhat";
import { EthrDID } from "ethr-did";
import { createVerifiableCredentialJwt } from "did-jwt-vc";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

// const PINATA_API_KEY = process.env.PINATA_API_KEY!;
// const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY!;
// const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
// const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY!;
// const INFURA_API_KEY = process.env.INFURA_API_KEY!;
// const PATIENT_ADDRESSES = process.env.PATIENT_ADDRESSES ? process.env.PATIENT_ADDRESSES.split(",") : [];

//const provider = new JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
//const provider = new JsonRpcProvider("http://127.0.0.1:8545");

//const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
//const contract = (await ethers.getContractFactory("HealthRecords")).attach(CONTRACT_ADDRESS).connect(signer);




// const createDID = (ethAddress: string) => {
//     return new EthrDID({
//         identifier: ethAddress,
//         privateKey: process.env.PRIVATE_KEY,
//         provider
//     });
// };

// const createVC = async (did: string, patientData: any) => {
//     if (!signer) throw new Error("Signer is undefined. Ensure provider and private key are set.");
    
//     const ethrDid = new EthrDID({
//         identifier: signer.address,  // Ensure this is a DID, not just an address
//         privateKey: process.env.PRIVATE_KEY,     // Private key is needed for signing
//         provider,
//     });

//     const vcPayload = {
//         sub: did,
//         nbf: Math.floor(Date.now() / 1000),
//         vc: {
//             "@context": ["https://www.w3.org/2018/credentials/v1"],
//             type: ["VerifiableCredential", "HealthRecord"],
//             credentialSubject: {
//                 id: did,
//                 ...patientData
//             }
//         }
//     };

//     const issuer = {
//         did: ethrDid.did,   // DID of the issuer
//         signer: ethrDid.signer ?? (() => { throw new Error("Signer is undefined."); })(), // Safer way
//         alg: "ES256K" // Explicitly defining the algorithm
//     };

//     return await createVerifiableCredentialJwt(vcPayload, issuer);
// };


// 🚀 Function to Create a Verifiable Credential (VC)
// const createVC = async (did: string, patientData: any) => {
//     const ethrDid = new EthrDID({
//         identifier: signer.address,
//         privateKey: PRIVATE_KEY,
//         provider,
//     });
//     const vcPayload = {
//         sub: did,
//         nbf: Math.floor(Date.now() / 1000),
//         vc: {
//             "@context": ["https://www.w3.org/2018/credentials/v1"],
//             type: ["VerifiableCredential", "HealthRecord"],
//             credentialSubject: {
//                 id: did,
//                 ...patientData
//             }
//         }
//     };
//     return await createVerifiableCredentialJwt(vcPayload, ethrDid);
// };

// 🚀 Function to Upload the VC to IPFS via Pinata
const uploadToIPFS = async (data: any, filename: string) => {
    const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        { pinataContent: data, pinataMetadata: { name: filename } },
        { headers: { pinata_api_key: process.env.PINATA_API_KEY, pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY } }
    );
    return response.data.IpfsHash;
};

// 🚀 Main Function
async function main() {

    const PINATA_API_KEY = process.env.PINATA_API_KEY!;
    const PINATA_SECRET_API_KEY = process.env.PINATA_SECRET_API_KEY!;
    const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS!;
    const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY!;
    const INFURA_API_KEY = process.env.INFURA_API_KEY!;
    const PATIENT_ADDRESSES = process.env.PATIENT_ADDRESSES ? process.env.PATIENT_ADDRESSES.split(",") : [];


   // const provider = new JsonRpcProvider(`https://sepolia.infura.io/v3/${INFURA_API_KEY}`);
    const provider = new JsonRpcProvider("http://127.0.0.1:8545");
    //const signer = new ethers.Wallet("0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d", provider);
    const [signer] = await ethers.getSigners(); // signer[0] is the first default account

    console.log("Signer address:", signer.address);

    // Attach the contract to the provider and connect the signer
    const contract = await ethers.getContractFactory("HealthRecords");
    const contractWithSigner = contract.attach(CONTRACT_ADDRESS).connect(signer);


   // const contract = (await ethers.getContractFactory("HealthRecords")).attach(CONTRACT_ADDRESS).connect(signer);
    // const jsonFolderPath = path.join(__dirname, "../jsons");
    // if (!fs.existsSync(jsonFolderPath)) throw new Error("JSON folder not found");

    // const jsonFiles = fs.readdirSync(jsonFolderPath).filter(file => file.endsWith(".json"));

    const createDID = (ethAddress: string) => {
        return new EthrDID({
            identifier: ethAddress,
            privateKey: process.env.PRIVATE_KEY,
            chainNameOrId: "sepolia",
            provider
        });
    };
    
    // 🚀 Function to Create a Verifiable Credential (VC)
    const createVC = async (did: string, patientData: any) => {
        if (!signer) throw new Error("Signer is undefined. Ensure provider and private key are set.");
        
        const ethrDid = new EthrDID({
            identifier: signer.address,  // Ensure this is a DID, not just an address
            privateKey: process.env.PRIVATE_KEY,     // Private key is needed for signing
            provider,
        });
    
        const vcPayload = {
            sub: did,
            nbf: Math.floor(Date.now() / 1000),
            vc: {
                "@context": ["https://www.w3.org/2018/credentials/v1"],
                type: ["VerifiableCredential", "HealthRecord"],
                credentialSubject: {
                    id: did,
                    ...patientData
                }
            }
        };
    
        const issuer = {
            did: ethrDid.did,   // DID of the issuer
            signer: ethrDid.signer ?? (() => { throw new Error("Signer is undefined."); })(), // Safer way
            alg: "ES256K" // Explicitly defining the algorithm
        };
    
        return await createVerifiableCredentialJwt(vcPayload, issuer);
    };

    const jsonFolderPath = path.join(__dirname, "../jsons");    
        if (!fs.existsSync(jsonFolderPath)) {
            throw new Error("JSON folder not found: " + jsonFolderPath);
        }
    
        const jsonFiles = fs.readdirSync(jsonFolderPath).filter(file => file.endsWith(".json"));
        if (jsonFiles.length !== PATIENT_ADDRESSES.length) {
            throw new Error("Mismatch: The number of JSON files and patient addresses must be the same.");
        }

    for (let i = 0; i < PATIENT_ADDRESSES.length; i++) {
        const patient = PATIENT_ADDRESSES[i];
        const file = jsonFiles[i];
        console.log(`Processing ${file}...`);
        const filePath = path.join(jsonFolderPath, file);
        const rawData = fs.readFileSync(filePath);
        const patientData = JSON.parse(rawData.toString());

        // 🔹 Step 1: Generate a DID for the Patient
        const patientDID = createDID(patient).did;
        console.log(`Generated DID: ${patientDID}`);

        // 🔹 Step 2: Create a Verifiable Credential (VC)
        const vc = await createVC(patientDID, patientData);
        console.log(`Created VC for ${patientDID}`);

        // 🔹 Step 3: Upload the VC to IPFS
        const ipfsHash = await uploadToIPFS(vc, `${patientData.name}.json`);
        console.log(`Uploaded VC to IPFS: ${ipfsHash}`);

        // 🔹 Step 4: Register the IPFS Hash to the Smart Contract
        try {
            const tx = await (contractWithSigner as Contract).initializePatientRecord(patientDID, ipfsHash);

            //const tx = await (contract!.connect(signer) as Contract).initializePatientRecord(patientDID, ipfsHash);
            console.log("Waiting for transaction confirmation...");
            await tx.wait();
            console.log(`Successfully registered VC on blockchain for ${patientDID}`);
        } catch (error) {
            console.error(`Failed to register VC for ${patientDID}`, error);
        }
    }
}

main().catch(error => {
    console.error("Error:", error);
    process.exit(1);
});
