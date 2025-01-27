import {
    denyAccessRequest,
    getAccessList,
    getAccessRequests,
    getHealthRecordHash,
    getUpdates,
    grantAccess,
    requestAccess,
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
        const ownerPrivateKey = process.env.OWNER_PRIVATE_KEY;
        const otherPrivateKey = process.env.OTHER_PRIVATE_KEY;
        const otherAddress = process.env.OTHER_ADDRESS

        if (!ownerAddress  || !ownerPrivateKey || !otherPrivateKey || !otherAddress) {
            throw new Error(
                "Required environment variables are missing: OWNER_ADDRESS, PERMISSIONED_USER_ADDRESS, OWNER_PRIVATE_KEY, OTHER_PRIVATE_KEY, OTHER_ADDRESS"
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
        console.log("Updating health record...");
        await updateHealthRecord(fetchedIpfsHash, otherPrivateKey);

        // 3. Get Access List
        console.log("Fetching access list...");
        const accessList1 = await getAccessList();
        console.log("Access List:", accessList1);

        // 6. Request Access
        console.log(`Requesting access to ${ownerAddress}...`);
        await requestAccess(ownerAddress, otherPrivateKey);

        // 6. Get requested access
        console.log("Fetching access requests...");
        const accessRequests1 = await getAccessRequests();
        console.log("Access Requests:", accessRequests1);

        // 7. Deny Access Request
        console.log(`Denying access request from ${otherAddress}...`);
        await denyAccessRequest(otherAddress, ownerPrivateKey);

        // 6. Get requested access
        console.log("Fetching access requests...");
        const accessRequests2 = await getAccessRequests();
        console.log("Access Requests:", accessRequests2);

        // 3. Get Access List
        console.log("Fetching access list...");
        const accessList2 = await getAccessList();
        console.log("Access List:", accessList2);

        // 6. Request Access
        console.log(`Requesting access to ${ownerAddress}...`);
        await requestAccess(ownerAddress, otherPrivateKey);

        // 4. Grant Access
        console.log(`Granting access to ${otherAddress}...`);
        await grantAccess(otherAddress, ownerPrivateKey);

        // 6. Get requested access
        console.log("Fetching access requests...");
        const accessRequests3 = await getAccessRequests();
        console.log("Access Requests:", accessRequests3);

        // 3. Get Access List
        console.log("Fetching access list...");
        const accessList3 = await getAccessList();
        console.log("Access List:", accessList3);

        // 5. Revoke Access
        console.log(`Revoking access from ${otherAddress}...`);
        await revokeAccess(otherAddress, ownerPrivateKey);

        // 3. Get Access List
        console.log("Fetching access list...");
        const accessList4 = await getAccessList();
        console.log("Access List:", accessList4);

        // 6. Get Updates
        console.log("Fetching updates...");
        const updates = await getUpdates();
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
