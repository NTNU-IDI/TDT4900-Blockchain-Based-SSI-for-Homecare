import { Patient, Task } from '../types/patientInterfaces';
import { fetchIPFSData, unpinFromIPFS, uploadToIPFS } from './pinataService';
import {
  getHealthRecordHash,
  hasAccess,
  hasRequestedAccess
} from './contractService';

import { updateHealthRecord } from './contractService';

async function fetchPatientData(ownerAddress: string): Promise<Patient> {
  try {
    // Get IPFS hash from the contract
    console.log(`Fetching health record for owner: ${ownerAddress}`);
    const ipfsHash = await getHealthRecordHash(ownerAddress);
    console.log(`Fetched IPFS hash: ${ipfsHash}`);

    // Fetch patient data from IPFS
    console.log('Fetching patient data from IPFS...');
    const data = await fetchIPFSData(ipfsHash);

    const access = await hasAccess(ownerAddress);
    const requestedAccess = await hasRequestedAccess(ownerAddress);

    // Map the fetched data to the Patient interface
    const patient: Patient = {
      id: ownerAddress, // Using ownerAddress as the ID
      time: data.time,
      name: data.name,
      address: data.address,
      nøkkelnummer: data.nøkkelnummer || '',
      status: 'Ikke startet', // Default status
      tasks: data.tasks.map((task: Task) => ({
        ...task,
        status: 'Ikke startet' // Default task status
      })),
      notes: data.notes || [],
      access: access, // Default access
      accessRequest: requestedAccess, // Default access request state
      journal: data.journal
    };

    return patient;
  } catch (error) {
    console.error('Error fetching patient data:', error);
    throw error;
  }
}

export async function fetchAllPatients(
  ownerAddresses: string[]
): Promise<Patient[]> {
  const patients: Patient[] = [];
  for (const ownerAddress of ownerAddresses) {
    try {
      const patient = await fetchPatientData(ownerAddress);
      patients.push(patient);
    } catch (error) {
      console.error(
        `Error fetching patient for address ${ownerAddress}:`,
        error
      );

      const requestedAccess = await hasRequestedAccess(ownerAddress);

      patients.push({
        id: ownerAddress, // Use ownerAddress as the ID
        time: '', // Default empty values
        name: 'Ukjent', // Placeholder name
        address: 'null', // Default empty address
        nøkkelnummer: '',
        status: '', // Indicate failure
        tasks: [],
        notes: [],
        access: false, // No access by default
        accessRequest: requestedAccess, // No request made by default
        journal: {
          diagnoses: [],
          medications: [],
          previousTreatments: []
        } // Empty journal
      });
    }
  }
  console.log(patients);
  return patients;
}

export async function addPatientNote(
  ownerAddress: string,
  privateKey: string,
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

    console.log('Uploading updated patient data to IPFS...');
    const filename = `${data.name.replace(/\s+/g, '')}.json`;
    const newIpfsHash = await uploadToIPFS(data, filename);

    console.log('Updating smart contract with new IPFS hash...');
    await updateHealthRecord(ownerAddress, privateKey, newIpfsHash);

    console.log('Note successfully added!');
  } catch (error) {
    console.error('Error adding note to patient data:', error);
    throw error;
  }
}
