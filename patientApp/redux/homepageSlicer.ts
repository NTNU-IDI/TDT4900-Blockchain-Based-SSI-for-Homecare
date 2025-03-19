import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import fetchIPFSData from "../services/PinataService";
import { getOwnHealthRecordHash } from "../services/BlockchainService";

// Define the initial state
interface HomepageState {
  data: { name: string; notes: string[] };
  loading: boolean;
  error: string | null;
}

const initialState: HomepageState = {
  data: { name: "", notes: [] },
  loading: true,
  error: null,
};

// Async thunk for fetching data (only runs once)
export const fetchHomepageData = createAsyncThunk(
  "homepage/fetchData",
  async () => {
    const hash = await getOwnHealthRecordHash();
    console.log("yo")
    console.log("Fetched hash:", hash);
    const personalData = await fetchIPFSData(hash);
    console.log("Fetched data:", personalData);
    return { name: personalData.name, notes: personalData.notes || [] };
  },
);

// Create Redux slice
const homepageSlicer = createSlice({
  name: "homepage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomepageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomepageData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchHomepageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch data";
      });
  },
});

export default homepageSlicer.reducer;
