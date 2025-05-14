import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import fetchIPFSData from "../services/PinataService";
import { getOwnHealthRecordHash } from "../services/BlockchainService";

interface HomepageState {
  data: { name: string };
  loading: boolean;
  error: string | null;
}

const initialState: HomepageState = {
  data: { name: "" },
  loading: true,
  error: null,
};

export const fetchHomepageData = createAsyncThunk(
  "homepage/fetchData",
  async () => {
    const hash = await getOwnHealthRecordHash();
    const personalData = await fetchIPFSData(hash);
    return {name: personalData.name};
  },
);

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
