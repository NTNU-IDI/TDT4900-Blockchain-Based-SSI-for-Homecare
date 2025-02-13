import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { HOMECARE_WORKER_ADDRESS } from '@env';
import { Worker } from '../types/workerInterfaces';

const workerData: Record<
  string,
  Worker
> = require('../assets/homecare_workers.json');

export const fetchWorker = createAsyncThunk(
  'worker/fetchWorker',
  async (_, thunkAPI) => {
    try {
      const worker: Worker = {
        navn: workerData[HOMECARE_WORKER_ADDRESS]?.navn || 'Ukjent',
        arbeidsplass:
          workerData[HOMECARE_WORKER_ADDRESS]?.arbeidsplass || 'Ukjent',
        yrke: workerData[HOMECARE_WORKER_ADDRESS]?.yrke || 'Ukjent'
      };

      return worker;
    } catch (error) {
      console.error('Error fetching worker data:', error);
      return thunkAPI.rejectWithValue('Failed to fetch worker data');
    }
  }
);

interface WorkerState {
  worker: Worker | null;
}

const initialState: WorkerState = {
  worker: null
};

const workerSlice = createSlice({
  name: 'worker',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchWorker.fulfilled,
      (state, action: PayloadAction<Worker>) => {
        state.worker = action.payload;
      }
    );
  }
});

export default workerSlice.reducer;
