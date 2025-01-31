import { Patient, Task } from '../types/patientInterfaces';
import {
  getHealthRecordHash,
  hasAccess,
  hasRequestedAccess
} from './contractService';

import fetchIPFSData from './pinataService';

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
