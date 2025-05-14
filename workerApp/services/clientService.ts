import { Client, Task } from '../types/client';
import { fetchIPFSData, unpinFromIPFS, uploadToIPFS } from './pinataService';
import {
  getHealthRecordHash,
  hasAccess,
  hasRequestedAccess,
  updateHealthRecord
} from './contractService';

export async function fetchClientData(ownerAddress: string): Promise<Client> {
  try {
    console.log(`Fetching health record for owner: ${ownerAddress}`);
    const ipfsHash = await getHealthRecordHash(ownerAddress);
    console.log(`Fetched IPFS hash: ${ipfsHash}`);
    console.log('Fetching client data from IPFS...');
    const data = await fetchIPFSData(ipfsHash);

    const [access, requestedAccess] = await Promise.all([
      hasAccess(ownerAddress),
      hasRequestedAccess(ownerAddress)
    ]);

    const client: Client = {
      id: ownerAddress,
      time: data.time,
      name: data.name,
      address: data.address,
      nøkkelnummer: data.nøkkelnummer || '',
      status: 'Ikke startet',
      tasks: data.tasks.map((task: Task) => ({
        ...task,
        status: 'Ikke startet'
      })),
      notes: data.notes || [],
      access: access,
      accessRequest: requestedAccess,
      journal: data.journal
    };

    return client;
  } catch (error) {
    console.log('Could not fetch client data:', error);
    const requestedAccess = await hasRequestedAccess(ownerAddress);

    return {
      id: ownerAddress,
      time: '',
      name: 'Ukjent',
      address: 'null',
      nøkkelnummer: '',
      status: '',
      tasks: [],
      notes: [],
      access: false,
      accessRequest: requestedAccess,
      journal: {
        diagnoses: [],
        medications: [],
        previousTreatments: []
      }
    };
  }
}

export async function fetchAllClients(
  ownerAddresses: string[]
): Promise<Client[]> {
  const clientPromises = ownerAddresses.map(fetchClientData);
  const clients = await Promise.all(clientPromises);
  return clients;
}

export async function addClientNote(
  ownerAddress: string,
  newNote: string,
  workerName: string
) {
  try {
    const hasPermission = await hasAccess(ownerAddress);
    if (!hasPermission) {
      throw new Error('Access denied. Unable to add note.');
    }

    const oldIpfsHash = await getHealthRecordHash(ownerAddress);

    const data = await fetchIPFSData(oldIpfsHash);

    if (oldIpfsHash) {
      console.log(`Removing old IPFS file: ${oldIpfsHash}`);
      await unpinFromIPFS(oldIpfsHash);
      console.log('Old IPFS file removed successfully.');
    }

    if (!data.notes) {
      data.notes = [];
    }

    const formattedDate = new Intl.DateTimeFormat('no-NO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date());

    data.notes.push([newNote, formattedDate, workerName]);

    console.log('Uploading updated client data to IPFS...');
    const filename = `${data.name.replace(/\s+/g, '')}.json`;
    const newIpfsHash = await uploadToIPFS(data, filename);
    try {
      console.log('Updating smart contract with new IPFS hash...');
      await updateHealthRecord(ownerAddress, newIpfsHash, 'Added note');
    } catch (error) {
      console.error('Error updating blockchain:', error);
      console.log(`Removing the uploaded IPFS file: ${newIpfsHash}`);
      await unpinFromIPFS(newIpfsHash);
      console.log('Uploaded IPFS file removed successfully.');
      throw error;
    }

    console.log('Note successfully added!');
  } catch (error) {
    console.error('Error adding note to client data:', error);
    throw error;
  }
}
