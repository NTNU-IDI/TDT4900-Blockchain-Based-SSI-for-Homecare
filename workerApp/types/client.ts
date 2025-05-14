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

interface Client {
  id: string;
  time: string;
  name: string;
  address: string;
  nøkkelnummer: string;
  status: string; // 'Ikke startet', 'Påbegynt', 'Ferdig'
  tasks: Task[];
  notes: string[];
  access: boolean; // 'Tilgang' or 'Ikke tilgang'
  accessRequest: boolean;
  journal: Journal;
}

export { Client, Task, Journal };
