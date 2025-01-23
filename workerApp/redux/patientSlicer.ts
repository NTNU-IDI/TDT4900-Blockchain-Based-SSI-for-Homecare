import { PayloadAction, createSlice } from '@reduxjs/toolkit';

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
  access: string; // 'Tilgang' or 'Ikke tilgang'
  accessRequest: boolean; // Tracks if access has been requested
  journal: Journal; // Patient-specific journal data
}

interface PatientState {
  currentPatientId: string | null;
  patients: Patient[];
}

const initialState: PatientState = {
  currentPatientId: '1',
  patients: [
    {
      id: '1',
      time: '09:00',
      name: 'Ole Hansen',
      address: 'Osloveien 123',
      nøkkelnummer: '123',
      status: 'Ikke startet',
      tasks: [
        {
          id: 1,
          name: 'Sjekk blodtrykk',
          description: 'Mål blodtrykket før frokost.',
          duration: 5,
          status: 'Ikke startet'
        },
        {
          id: 2,
          name: 'Hjelp med frokost',
          description: 'Assister pasienten med å lage frokost.',
          duration: 10,
          status: 'Ikke startet'
        }
      ],
      access: 'Tilgang',
      accessRequest: false,
      journal: {
        diagnoses: [
          'Hypertensjon, diagnostisert 2015',
          'Diabetes type 2, diagnostisert 2018'
        ],
        medications: [
          'Metformin - 500mg daglig',
          'Simvastatin - 10mg ved behov'
        ],
        previousTreatments: [
          'Ernæringsrådgivning',
          'Fysioterapi for mobilitetsproblemer'
        ]
      }
    },
    {
      id: '2',
      time: '09:30',
      name: 'Anne Kristiansen',
      address: 'Singsakerbakken 3',
      nøkkelnummer: '234',
      status: 'Ikke startet',
      tasks: [
        {
          id: 1,
          name: 'Tannpuss',
          description: 'Hjelp pasienten med tannpuss etter frokost.',
          duration: 5,
          status: 'Ikke startet'
        }
      ],
      access: 'Tilgang',
      accessRequest: false,
      journal: {
        diagnoses: ['Osteoporose, diagnostisert 2020'],
        medications: ['Vitamin D - daglig', 'Kalsiumtilskudd - 500mg daglig'],
        previousTreatments: ['Behandling for brudd i venstre arm']
      }
    },
    {
      id: '3',
      time: '10:00',
      name: 'Lars Pedersen',
      address: 'Midtbyveien 1',
      nøkkelnummer: '',
      status: 'Ikke startet',
      tasks: [
        {
          id: 1,
          name: 'Støtte til gåtur',
          description: 'Gå en kort tur med pasienten for trening.',
          duration: 15,
          status: 'Ikke startet'
        },
        {
          id: 2,
          name: 'Måle blodsukker',
          description: 'Hjelp pasienten med å måle blodsukker.',
          duration: 5,
          status: 'Ikke startet'
        },
        {
          id: 3,
          name: 'Administrere medisin',
          description: 'Gi pasienten medisin som foreskrevet.',
          duration: 5,
          status: 'Ikke startet'
        }
      ],
      access: 'Ikke tilgang',
      accessRequest: false,
      journal: {
        diagnoses: ['Kols, diagnostisert 2019'],
        medications: ['Albuterol inhalator - 2 ganger daglig'],
        previousTreatments: ['Rehabilitering etter sykehusopphold']
      }
    },
    {
      id: '4',
      time: '10:40',
      name: 'Kari Johansen',
      address: 'Moholtveien 2',
      nøkkelnummer: '567',
      status: 'Ikke startet',
      tasks: [
        {
          id: 1,
          name: 'Tilberedning av lunsj',
          description: 'Lag en enkel lunsj sammen med pasienten.',
          duration: 10,
          status: 'Ikke startet'
        },
        {
          id: 2,
          name: 'Medisinering',
          description: 'Administrer pasientens faste medisiner.',
          duration: 5,
          status: 'Ikke startet'
        }
      ],
      access: 'Tilgang',
      accessRequest: false,
      journal: {
        diagnoses: ['Alzheimers, diagnostisert 2020'],
        medications: ['Donepezil - daglig'],
        previousTreatments: ['Kognitiv terapi for hukommelsestap']
      }
    },
    {
      id: '5',
      time: '11:05',
      name: 'Ingrid Olsen',
      address: 'Trondheimsveien 9',
      nøkkelnummer: '',
      status: 'Ikke startet',
      tasks: [
        {
          id: 1,
          name: 'Rengjøring',
          description: 'Vasking og støvsuging av gang, kjøkken og stue',
          duration: 15,
          status: 'Ikke startet'
        },
        {
          id: 2,
          name: 'Lese avisen',
          description: 'Lese dagens nyheter sammen med pasienten.',
          duration: 10,
          status: 'Ikke startet'
        },
        {
          id: 3,
          name: 'Lage middag',
          description: 'Lag middag sammen med pasienten.',
          duration: 20,
          status: 'Ikke startet'
        }
      ],
      access: 'Ikke tilgang',
      accessRequest: false,
      journal: {
        diagnoses: ['Hjertesykdom, diagnostisert 2017'],
        medications: ['Aspirin - 100mg daglig', 'Atorvastatin - 20mg daglig'],
        previousTreatments: ['Hjertesykdom kirurgi - 2017']
      }
    }
  ]
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setCurrentPatient: (state, action: PayloadAction<string>) => {
      state.currentPatientId = action.payload;
    },
    updatePatientStatus: (state, action: PayloadAction<{ status: string }>) => {
      const patient = state.patients.find(
        (p) => p.id === state.currentPatientId
      );
      if (patient) {
        patient.status = action.payload.status;
      }
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ taskId: number; status: string }>
    ) => {
      const patient = state.patients.find(
        (p) => p.id === state.currentPatientId
      );
      if (patient) {
        const task = patient.tasks.find((t) => t.id === action.payload.taskId);
        if (task) {
          task.status = action.payload.status;
        }
      }
    },
    updatePatientAccess: (
      state,
      action: PayloadAction<{ id: string; access: string }>
    ) => {
      const patient = state.patients.find((p) => p.id === action.payload.id);
      if (patient) {
        patient.access = action.payload.access;
      }
    },
    updateAccessRequest: (state, action: PayloadAction<string>) => {
      const patient = state.patients.find((p) => p.id === action.payload);
      if (patient) {
        patient.accessRequest = true;
      }
    }
  }
});

export const {
  setCurrentPatient,
  updatePatientStatus,
  updateTaskStatus,
  updatePatientAccess,
  updateAccessRequest
} = patientSlice.actions;

export default patientSlice.reducer;
