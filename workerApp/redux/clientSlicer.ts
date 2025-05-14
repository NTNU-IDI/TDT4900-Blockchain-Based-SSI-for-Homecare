import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addClientNote,
  fetchAllClients,
  fetchClientData
} from '../services/clientService';
import {
  hasAccess,
  hasRequestedAccess,
  requestAccess
} from '../services/contractService';

import { CLIENT_ADDRESSES } from '@env';
import { Client } from '../types/client';

export const fetchAndSetClients = createAsyncThunk(
  'clients/fetchAndSetClients',
  async (_: void, thunkAPI) => {
    try {
      const clientAddresses = CLIENT_ADDRESSES.split(',');
      return await fetchAllClients(clientAddresses);
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('An unknown error occurred');
    }
  }
);

export const requestClientAccess = createAsyncThunk(
  'clients/requestclientAccess',
  async ({ clientId, note }: { clientId: string; note: string }, thunkAPI) => {
    try {
      await requestAccess(clientId, note);
      return { clientId: clientId, note };
    } catch (error) {
      console.error('Error requesting access:', error);
      return thunkAPI.rejectWithValue('Failed to send request');
    }
  }
);

const fetchAndSetClient = createAsyncThunk(
  'clients/fetchAndSetClient',
  async (clientID: string, thunkAPI) => {
    try {
      const updatedClient = await fetchClientData(clientID);
      return { clientID, updatedClient };
    } catch (error) {
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue('An unknown error occurred');
    }
  }
);

export const fetchAccessStatus = createAsyncThunk(
  'clients/fetchAccessStatus',
  async (
    {
      clientId,
      currentAccessStatus
    }: { clientId: string; currentAccessStatus: boolean },
    thunkAPI
  ) => {
    try {
      const hasWorkerAccess = await hasAccess(clientId);
      if (currentAccessStatus != hasWorkerAccess) {
        await thunkAPI.dispatch(fetchAndSetClient(clientId));
      }
      const hasRequested = await hasRequestedAccess(clientId);
      return {
        clientId: clientId,
        access: hasWorkerAccess,
        requestedAccess: hasRequested
      };
    } catch (error) {
      console.error('Error checking access:', error);
      return thunkAPI.rejectWithValue('Failed to check access');
    }
  }
);

export const addClientTasksNote = createAsyncThunk(
  'clients/addClientTasksNote',
  async (
    {
      clientId,
      note,
      workerName
    }: { clientId: string; note: string; workerName: string },
    thunkAPI
  ) => {
    try {
      await addClientNote(clientId, note, workerName);
      return { clientId: clientId, note };
    } catch (error) {
      console.error('Error adding visit note:', error);
      return thunkAPI.rejectWithValue('Failed to add visit note');
    }
  }
);

interface ClientState {
  currentClientId: string | null;
  clients: Client[];
}

const initialState: ClientState = {
  currentClientId: null,
  clients: []
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setCurrentClient: (state, action: PayloadAction<string>) => {
      state.currentClientId = action.payload;
    },
    updateClientStatus: (state, action: PayloadAction<{ status: string }>) => {
      const client = state.clients.find((c) => c.id === state.currentClientId);
      if (client) {
        client.status = action.payload.status;
      }
    },
    updateTaskStatus: (
      state,
      action: PayloadAction<{ taskId: number; status: string }>
    ) => {
      const client = state.clients.find((c) => c.id === state.currentClientId);
      if (client) {
        const task = client.tasks.find((t) => t.id === action.payload.taskId);
        if (task) {
          task.status = action.payload.status;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchAndSetClients.fulfilled,
        (state, action: PayloadAction<Client[]>) => {
          state.clients = action.payload;
          state.currentClientId =
            action.payload.length > 0 ? action.payload[0].id : null;
        }
      )
      .addCase(fetchAndSetClients.rejected, (_, action) => {
        console.error('Error fetching clients:', action.payload);
      })
      .addCase(
        requestClientAccess.fulfilled,
        (state, action: PayloadAction<{ clientId: string; note: string }>) => {
          const client = state.clients.find(
            (p) => p.id === action.payload.clientId
          );
          if (client) {
            client.accessRequest = true;
            console.log('Access requested for client:', client.name);
          }
        }
      )
      .addCase(
        fetchAccessStatus.fulfilled,
        (
          state,
          action: PayloadAction<{
            clientID: string;
            access: boolean;
            requestedAccess: boolean;
          }>
        ) => {
          const client = state.clients.find(
            (p) => p.id === action.payload.clientID
          );
          if (client) {
            client.access = action.payload.access;
            client.accessRequest = action.payload.requestedAccess;
          }
        }
      )
      .addCase(
        fetchAndSetClient.fulfilled,
        (
          state,
          action: PayloadAction<{ clientID: string; updatedClient: Client }>
        ) => {
          const client = state.clients.find(
            (c) => c.id === action.payload.clientID
          );
          if (client) {
            Object.assign(client, action.payload.updatedClient);
          }
        }
      );
  }
});

export const { setCurrentClient, updateClientStatus, updateTaskStatus } =
  clientSlice.actions;

export default clientSlice.reducer;
