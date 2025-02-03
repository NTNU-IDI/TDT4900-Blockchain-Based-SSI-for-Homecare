import { configureStore } from '@reduxjs/toolkit';
import patientReducer from './patientSlicer';
import workerReducer from './workerSlicer';

export const store = configureStore({
  reducer: {
    patient: patientReducer,
    worker: workerReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
