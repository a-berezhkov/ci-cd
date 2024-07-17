import { apiSlice } from "../features/api/apiSlice";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
