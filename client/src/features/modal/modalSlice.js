import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isShown: false,
  login: false,
  signup: false,
  download: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleModal: (state, action) => {
      state.isShown = !state.isShown;
      if (!state.isShown) {
        state.signup = false;
        state.download = false;
        state.login = false;
      }
    },
    toggleLogin: (state, action) => {
      state.login = !state.login;
    },
    toggleSignup: (state, action) => {
      state.signup = !state.signup;
    },
    toggleDownload: (state, action) => {
      state.download = !state.download;
    },
  },
});

export default modalSlice;
