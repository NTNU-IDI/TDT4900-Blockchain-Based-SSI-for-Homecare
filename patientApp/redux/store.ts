import { configureStore } from "@reduxjs/toolkit";
import homepageReducer from "./homepageSlice";

const store = configureStore({
  reducer: {
    homepage: homepageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
