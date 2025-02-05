require('dotenv').config();

const {
  OWNER_ADDRESS,
  OWNER_PRIVATE_KEY,
  OTHER_ADDRESS,
  OTHER_PRIVATE_KEY
} = process.env;

import { denyAccessRequest, getAccessList, getAccessRequests, getHealthRecordHash, getUpdates, grantAccess, requestAccess, revokeAccess, updateHealthRecord } from './contactService';

import fetchIPFSData from './PinataService';

async function main() {
  try {
    if (
      !OWNER_ADDRESS ||
      !OWNER_PRIVATE_KEY ||
      !OTHER_PRIVATE_KEY ||
      !OTHER_ADDRESS
    ) {
      throw new Error(
        'Required environment variables are missing: OWNER_ADDRESS, OWNER_PRIVATE_KEY, OTHER_PRIVATE_KEY, OTHER_ADDRESS'
      );
    }

  
      // 1. Get own Health Record
      console.log('Fetching own health record hash...');
      const fetchedIpfsHash = await getHealthRecordHash(OWNER_ADDRESS);
      console.log(`Fetched IPFS Hash: ${fetchedIpfsHash}`);
      console.log('Fetching data from IPFS...');
      const data = await fetchIPFSData(fetchedIpfsHash);
      console.log('Data:', data);
  
      // 2. Update Health Record without access (should fail)
      // console.log("Updating health record...");
      // await updateHealthRecord(fetchedIpfsHash, OTHER_PRIVATE_KEY);
  
      // 3. Get Access List
      console.log('Fetching access list...');
      const accessList1 = await getAccessList();
      console.log('Access List:', accessList1);
  
      // 6. Request Access
      console.log(`Requesting access to ${OWNER_ADDRESS}...`);
      await requestAccess(OWNER_ADDRESS, OTHER_PRIVATE_KEY);
  
      // 6. Get requested access
      console.log('Fetching access requests...');
      const accessRequests1 = await getAccessRequests();
      console.log('Access Requests:', accessRequests1);
  
      // 7. Deny Access Request
      console.log(`Denying access request from ${OTHER_ADDRESS}...`);
      await denyAccessRequest(OTHER_ADDRESS, OWNER_PRIVATE_KEY);
  
      // 6. Get requested access
      console.log('Fetching access requests...');
      const accessRequests2 = await getAccessRequests();
      console.log('Access Requests:', accessRequests2);
  
      // 3. Get Access List
      console.log('Fetching access list...');
      const accessList2 = await getAccessList();
      console.log('Access List:', accessList2);
  
      // 6. Request Access
      console.log(`Requesting access to ${OWNER_ADDRESS}...`);
      await requestAccess(OWNER_ADDRESS, OTHER_PRIVATE_KEY);
  
      // 4. Grant Access
      console.log(`Granting access to ${OTHER_ADDRESS}...`);
      await grantAccess(OTHER_ADDRESS, OWNER_PRIVATE_KEY);
  
    //   // 6. Get requested access
      console.log('Fetching access requests...');
      const accessRequests3 = await getAccessRequests();
      console.log('Access Requests:', accessRequests3);
  
    //   // 3. Get Access List
      console.log('Fetching access list...');
      const accessList3 = await getAccessList();
      console.log('Access List:', accessList3);
  
    //   // 2. Update Health Record with access
      console.log('Updating health record...');
      await updateHealthRecord(OWNER_ADDRESS, OTHER_PRIVATE_KEY);
  
    //   // 5. Revoke Access
      console.log(`Revoking access from ${OTHER_ADDRESS}...`);
      await revokeAccess(OTHER_ADDRESS, OWNER_PRIVATE_KEY);
  
    //   // 3. Get Access List
      console.log('Fetching access list...');
      const accessList4 = await getAccessList();
      console.log('Access List:', accessList4);
  
      // 6. Get Updates
      console.log('Fetching updates...');
      const updates = await getUpdates();
      console.log('Updates:', updates);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
      } else {
        console.error('Unknown error:', error);
      }
    }
  }
  
  main();
  