import { createSlice } from '@reduxjs/toolkit';

interface AccessState {
  isAccessRevoked: boolean;
}

const initialState: AccessState = {
  isAccessRevoked: false,
};

const accessSlice = createSlice({
  name: 'access',
  initialState,
  reducers: {
    revokeAccess: (state) => {
      state.isAccessRevoked = true;
    },
    resetAccess: (state) => {
      state.isAccessRevoked = false;
    },
  },
});

export const { revokeAccess, resetAccess } = accessSlice.actions;
export default accessSlice.reducer;
