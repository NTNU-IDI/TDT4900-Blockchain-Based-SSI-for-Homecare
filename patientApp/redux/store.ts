import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import accessReducer from './accessSlice';

// Configuration for persistence
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Persist the accessReducer
const persistedReducer = persistReducer(persistConfig, accessReducer);

// Create the Redux store
export const store = configureStore({
  reducer: {
    access: persistedReducer,
  },
});

// Persistor for redux-persist
export const persistor = persistStore(store);

// Types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
