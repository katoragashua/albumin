import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "../features/modal/modalSlice";
import photosSlice from "../features/photos/photosSlice";
import authSlice from "../features/auth/authSlice";
const { reducer: modalReducer } = modalSlice;
const { reducer: photosReducer } = photosSlice;
const {reducer: authReducer} = authSlice

export const store = configureStore({
  reducer: {
    modal: modalReducer,
    photos: photosReducer,
    auth: authReducer
  },
});