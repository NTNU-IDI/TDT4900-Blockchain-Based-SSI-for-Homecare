import clientReducer from './clientSlicer';
import { configureStore } from '@reduxjs/toolkit';
import workerReducer from './workerSlicer';

export const store = configureStore({
  reducer: {
    client: clientReducer,
    worker: workerReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
