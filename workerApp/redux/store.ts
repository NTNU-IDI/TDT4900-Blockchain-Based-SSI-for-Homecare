import { PayloadAction, configureStore, createSlice } from '@reduxjs/toolkit';

type Task = {
  id: number;
  name: string;
  description: string;
  duration: number; // in minutes
  status: string; // 'Ikke startet', 'Påbegynt', 'Ferdig'
};

type Patient = {
  id: string;
  time: string;
  name: string;
  address: string;
  nøkkelnummer: string;
  status: string; // 'Ikke startet', 'Påbegynt', 'Ferdig'
  tasks: Task[];
  access: string; // 'Tilgang' or 'Ikke tilgang'
};

type PatientState = {
  currentPatientId: string | null;
  patients: Patient[];
};

// Initial State
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
        { id: 1, name: 'Sjekk blodtrykk', description: 'Mål blodtrykket før frokost.', duration: 1, status: 'Ikke startet' },
        { id: 2, name: 'Hjelp med frokost', description: 'Assister pasienten med å lage frokost.', duration: 2, status: 'Ikke startet' },
      ],
      access: 'Tilgang',
    },
    {
      id: '2',
      time: '09:30',
      name: 'Anne Kristiansen',
      address: 'Singsakerbakken 3',
      nøkkelnummer: '234',
      status: 'Ikke startet',
      tasks: [
        { id: 1, name: 'Tannpuss', description: 'Hjelp pasienten med tannpuss etter frokost.', duration: 5, status: 'Ikke startet' },
      ],
      access: 'Tilgang',
    },
    {
      id: '3',
      time: '10:00',
      name: 'Lars Pedersen',
      address: 'Midtbyveien 1',
      nøkkelnummer: '',
      status: 'Ikke startet',
      tasks: [
        { id: 1, name: 'Støtte til gåtur', description: 'Gå en kort tur med pasienten for trening.', duration: 15, status: 'Ikke startet' },
        { id: 2, name: 'Måle blodsukker', description: 'Hjelp pasienten med å måle blodsukker.', duration: 5, status: 'Ikke startet' },
        { id: 3, name: 'Administrere medisin', description: 'Gi pasienten medisin som foreskrevet.', duration: 5, status: 'Ikke startet' },
      ],
      access: 'Ikke tilgang',
    },
    {
      id: '4',
      time: '10:40',
      name: 'Kari Johansen',
      address: 'Moholtveien 2',
      nøkkelnummer: '567',
      status: 'Ikke startet',
      tasks: [
        { id: 1, name: 'Tilberedning av lunsj', description: 'Lag en enkel lunsj sammen med pasienten.', duration: 10, status: 'Ikke startet' },
        { id: 2, name: 'Medisinering', description: 'Administrer pasientens faste medisiner.', duration: 5, status: 'Ikke startet' },
      ],
      access: 'Tilgang',
    },
    {
      id: '5',
      time: '11:05',
      name: 'Ingrid Olsen',
      address: 'Trondheimsveien 9',
      nøkkelnummer: '',
      status: 'Ikke startet',
      tasks: [
        { id: 1, name: 'Rengjøring', description: 'Hjelp pasienten med rengjøring av rommet.', duration: 15, status: 'Ikke startet' },
        { id: 2, name: 'Lese avisen', description: 'Lese dagens nyheter sammen med pasienten.', duration: 10, status: 'Ikke startet' },
        { id: 3, name: 'Lage middag', description: 'Lag middag sammen med pasienten.', duration: 20, status: 'Ikke startet' },
      ],
      access: 'Tilgang',
    },
  ],
};

// Create Slice
const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setCurrentPatient: (state, action: PayloadAction<string>) => {
      state.currentPatientId = action.payload;
    },
    updatePatientStatus: (state, action: PayloadAction<{ id: string; status: string }>) => {
      const patient = state.patients.find((p) => p.id === action.payload.id);
      if (patient) {
        patient.status = action.payload.status;
      }
    },
    updateTaskStatus: (state, action: PayloadAction<{ patientId: string; taskId: number; status: string }>) => {
      const patient = state.patients.find((p) => p.id === action.payload.patientId);
      if (patient) {
        const task = patient.tasks.find((t) => t.id === action.payload.taskId);
        if (task) {
          task.status = action.payload.status;
        }
      }
    },
    updatePatientAccess: (state, action: PayloadAction<{ id: string; access: string }>) => {
      const patient = state.patients.find((p) => p.id === action.payload.id);
      if (patient) {
        patient.access = action.payload.access;
      }
    },
  },
});

// Export Actions
export const { setCurrentPatient, updatePatientStatus, updateTaskStatus, updatePatientAccess } =
  patientSlice.actions;

// Create Store
export const store = configureStore({
  reducer: {
    patient: patientSlice.reducer,
  },
});

// Export Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

