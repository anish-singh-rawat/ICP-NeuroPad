import { configureStore } from "@reduxjs/toolkit";
import utilityReducer from "./reducer/utilityReducer";

export const store = configureStore({
    reducer: {
        utility:utilityReducer,
        
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false, // Disable serializability check
        }),
});