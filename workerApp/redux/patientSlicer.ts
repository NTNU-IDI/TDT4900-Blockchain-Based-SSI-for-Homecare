import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { Patient } from '../types/patientInterfaces';
import { fetchAllPatients } from '../abi/patientService';
import { requestAccess } from '../abi/contractService';

export const fetchAndSetPatients = createAsyncThunk(
  'patients/fetchAndSetPatients',
  async (ownerAddresses: string[], thunkAPI) => {
    try {
      return await fetchAllPatients(ownerAddresses);
    } catch (error) {
      // Ensure error is cast to an appropriate type
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('An unknown error occurred');
    }
  }
);

export const requestPatientAccess = createAsyncThunk(
  'patients/requestPatientAccess',
  async (patientId: string, thunkAPI) => {
    try {
      await requestAccess(
        patientId,
        '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
      ); // Trigger access request via contract
      return patientId; // Return the patient ID upon success
    } catch (error) {
      console.error('Error requesting access:', error);
      return thunkAPI.rejectWithValue('Failed to send request');
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
    },
    updatePatientAccess: (
      state,
      action: PayloadAction<{ id: string; access: boolean }>
    ) => {
      const patient = state.patients.find((p) => p.id === action.payload.id);
      if (patient) {
        patient.access = action.payload.access;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAndSetPatients.fulfilled,
      (state, action: PayloadAction<Patient[]>) => {
        // Update state when fetch is successful
        state.patients = action.payload;
        state.currentPatientId =
          action.payload.length > 0 ? action.payload[0].id : null;
      }
    );

    builder.addCase(fetchAndSetPatients.rejected, (state, action) => {
      console.error('Error fetching patients:', action.payload);
    });
    builder.addCase(
      requestPatientAccess.fulfilled,
      (state, action: PayloadAction<string>) => {
        const patient = state.patients.find((p) => p.id === action.payload);
        if (patient) {
          patient.accessRequest = true;
          console.log('Access requested for patient:', patient.name);
        }
      }
    );
  }
});

export const {
  setCurrentPatient,
  updatePatientStatus,
  updateTaskStatus,
  updatePatientAccess
} = patientSlice.actions;

export default patientSlice.reducer;
