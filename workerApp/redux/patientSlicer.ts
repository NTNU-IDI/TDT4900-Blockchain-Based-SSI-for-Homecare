import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Patient } from "../types/patientInterfaces";
import { fetchAllPatients } from "../abi/patientService";

export const fetchAndSetPatients = createAsyncThunk(
  "patients/fetchAndSetPatients",
  async (ownerAddresses: string[], thunkAPI) => {
      try {
          return await fetchAllPatients(ownerAddresses);
      } catch (error) {
          // Ensure error is cast to an appropriate type
          if (error instanceof Error) {
              return thunkAPI.rejectWithValue(error.message);
          }
          return thunkAPI.rejectWithValue("An unknown error occurred");
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
    },
    updateAccessRequest: (state, action: PayloadAction<string>) => {
      const patient = state.patients.find((p) => p.id === action.payload);
      if (patient) {
        patient.accessRequest = true;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAndSetPatients.fulfilled, (state, action: PayloadAction<Patient[]>) => {
      // Update state when fetch is successful
      state.patients = action.payload;
      state.currentPatientId = action.payload.length > 0 ? action.payload[0].id : null;
    });

    builder.addCase(fetchAndSetPatients.rejected, (state, action) => {
      console.error('Error fetching patients:', action.payload);
    });
  },
});

export const {
  setCurrentPatient,
  updatePatientStatus,
  updateTaskStatus,
  updatePatientAccess,
  updateAccessRequest
} = patientSlice.actions;

export default patientSlice.reducer;
