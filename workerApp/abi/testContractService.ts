import {
    getAccessList,
    getHealthRecordHash,
    getUpdates,
    grantAccess,
    revokeAccess,
    updateHealthRecord,
} from "./contractService";

import dotenv from "dotenv";
import { ethers } from "ethers";
import fetchIPFSData from "./pinataService";

dotenv.config();

async function main() {
    try {
        const ownerAddress = process.env.OWNER_ADDRESS;
        const permissionedUser = process.env.PERMISSIONED_USER_ADDRESS;
        const privateKey = process.env.PRIVATE_KEY;

        if (!ownerAddress || !permissionedUser || !privateKey) {
            throw new Error(
                "Required environment variables are missing: OWNER_ADDRESS, PERMISSIONED_USER_ADDRESS, PRIVATE_KEY"
            );
        }
        
        // 1. Get Health Record
        console.log("Fetching health record hash...");
        const fetchedIpfsHash = await getHealthRecordHash(ownerAddress);
        console.log(`Fetched IPFS Hash: ${fetchedIpfsHash}`);
        console.log("Fetching data from IPFS...");
        const data = await fetchIPFSData(fetchedIpfsHash);
        console.log("Data:", data);

        // 2. Add or Update Health Record
        console.log("Adding or updating health record...");
        await updateHealthRecord(fetchedIpfsHash, privateKey);

        // 3. Get Access List
        console.log("Fetching access list...");
        const accessList1 = await getAccessList(ownerAddress);
        console.log("Access List:", accessList1);

        // 4. Grant Access
        console.log(`Granting access to ${permissionedUser}...`);
        await grantAccess(permissionedUser, privateKey);

        // 3. Get Access List
        console.log("Fetching access list...");
        const accessList2 = await getAccessList(ownerAddress);
        console.log("Access List:", accessList2);

        // 5. Revoke Access
        console.log(`Revoking access from ${permissionedUser}...`);
        await revokeAccess(permissionedUser, privateKey);

        // 3. Get Access List
        console.log("Fetching access list...");
        const accessList3 = await getAccessList(ownerAddress);
        console.log("Access List:", accessList3);

        // 6. Get Updates
        console.log("Fetching updates...");
        const updates = await getUpdates(ownerAddress);
        console.log("Updates:", updates);

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error:", error.message);
        } else {
            console.error("Unknown error:", error);
        }
    }
}

main();
