import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addPatientNote,
  fetchAllPatients,
  fetchPatientData
} from '../services/patientService';
import {
  hasAccess,
  hasRequestedAccess,
  requestAccess
} from '../services/contractService';

import { PATIENT_ADDRESSES } from '@env';
import { Patient } from '../types/patientInterfaces';

export const fetchAndSetPatients = createAsyncThunk(
  'patients/fetchAndSetPatients',
  async (_: void, thunkAPI) => {
    try {
      const patientAddresses = PATIENT_ADDRESSES.split(',');
      return await fetchAllPatients(patientAddresses);
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('An unknown error occurred');
    }
  }
);

export const requestPatientAccess = createAsyncThunk(
  'patients/requestPatientAccess',
  async (
    { patientId, note }: { patientId: string; note: string },
    thunkAPI
  ) => {
    try {
      await requestAccess(patientId, note);
      return { patientId, note };
    } catch (error) {
      console.error('Error requesting access:', error);
      return thunkAPI.rejectWithValue('Failed to send request');
    }
  }
);

const fetchAndSetPatient = createAsyncThunk(
  'patients/fetchAndSetPatient',
  async (patientID: string, thunkAPI) => {
    try {
      const updatedPatient = await fetchPatientData(patientID);
      return { patientID, updatedPatient };
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchAccessStatus = createAsyncThunk(
  'patients/fetchAccessStatus',
  async (
    {
      patientId,
      currentAccessStatus
    }: { patientId: string; currentAccessStatus: boolean },
    thunkAPI
  ) => {
    try {
      const hasWorkerAccess = await hasAccess(patientId);
      if (currentAccessStatus != hasWorkerAccess) {
        await thunkAPI.dispatch(fetchAndSetPatient(patientId));
      }
      const hasRequested = await hasRequestedAccess(patientId);
      return {
        patientId,
        access: hasWorkerAccess,
        requestedAccess: hasRequested
      };
    } catch (error) {
      console.error('Error checking access:', error);
      return thunkAPI.rejectWithValue('Failed to check access');
    }
  }
);

export const addPatientTasksNote = createAsyncThunk(
  'patients/addPatientTasksNote',
  async (
    {
      patientId,
      note,
      workerName
    }: { patientId: string; note: string; workerName: string },
    thunkAPI
  ) => {
    try {
      await addPatientNote(patientId, note, workerName);
      return { patientId, note };
    } catch (error) {
      console.error('Error adding patient note:', error);
      return thunkAPI.rejectWithValue('Failed to add patient note');
    }
  }
);

interface PatientState {
  currentPatientId: string | null;
  patients: Patient[];
}

const initialState: PatientState = {
  currentPatientId: null,
  patients: []
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchAndSetPatients.fulfilled,
        (state, action: PayloadAction<Patient[]>) => {
          state.patients = action.payload;
          state.currentPatientId =
            action.payload.length > 0 ? action.payload[0].id : null;
        }
      )
      .addCase(fetchAndSetPatients.rejected, (_, action) => {
        console.error('Error fetching patients:', action.payload);
      })
      .addCase(
        requestPatientAccess.fulfilled,
        (state, action: PayloadAction<{ patientId: string; note: string }>) => {
          const patient = state.patients.find(
            (p) => p.id === action.payload.patientId
          );
          if (patient) {
            patient.accessRequest = true;
            console.log('Access requested for patient:', patient.name);
          }
        }
      )
      .addCase(
        fetchAccessStatus.fulfilled,
        (
          state,
          action: PayloadAction<{
            patientId: string;
            access: boolean;
            requestedAccess: boolean;
          }>
        ) => {
          const patient = state.patients.find(
            (p) => p.id === action.payload.patientId
          );
          if (patient) {
            patient.access = action.payload.access;
            patient.accessRequest = action.payload.requestedAccess;
          }
        }
      )
      .addCase(
        fetchAndSetPatient.fulfilled,
        (
          state,
          action: PayloadAction<{ patientID: string; updatedPatient: Patient }>
        ) => {
          const patient = state.patients.find(
            (p) => p.id === action.payload.patientID
          );
          if (patient) {
            Object.assign(patient, action.payload.updatedPatient);
          }
        }
      );
  }
});

export const { setCurrentPatient, updatePatientStatus, updateTaskStatus } =
  patientSlice.actions;

export default patientSlice.reducer;
