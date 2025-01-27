import dotenv from "dotenv";
import fetchIPFSData from "./pinataService";
import getHealthRecordHash from "./contractService";

dotenv.config();

async function main() {
    try {
        // Validate and fetch the ownerAddress
        const ownerAddress = process.env.OWNER_ADDRESS;
        if (!ownerAddress) {
            throw new Error("OWNER_ADDRESS is not defined in the environment variables.");
        }

        // Call the function with the validated ownerAddress
        const ipfsHash = await getHealthRecordHash(ownerAddress);
        console.log(`IPFS Hash: ${ipfsHash}`);
        const data = await fetchIPFSData(ipfsHash);
        console.log("Data:", data);
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        } else {
            console.error("Unknown error:", error);
        }
    }
}

main();
