interface Task {
  id: number;
  name: string;
  description: string;
  duration: number; // in minutes
  status: string; // 'Ikke startet', 'Påbegynt', 'Ferdig'
}

interface Journal {
  diagnoses: string[];
  medications: string[];
  previousTreatments: string[];
}

interface Patient {
  id: string;
  time: string;
  name: string;
  address: string;
  nøkkelnummer: string;
  status: string; // 'Ikke startet', 'Påbegynt', 'Ferdig'
  tasks: Task[];
  notes: string[];
  access: boolean; // 'Tilgang' or 'Ikke tilgang'
  accessRequest: boolean; // Tracks if access has been requested
  journal: Journal; // Patient-specific journal data
}

export { Patient, Task, Journal };
