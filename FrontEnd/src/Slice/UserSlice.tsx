// this slice is used for the token and the user ditals are store in the localstorage

import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

const userSlice = createSlice({
  name: "user",
  initialState: localStorage.getItem("token")
    ? jwtDecode(localStorage.getItem("token") as string)
    : {},
  reducers: {
    setuser: (state, action) => {
      //   localStorage.setItem("token", action.payload);
      state = action.payload;
      return state;
    },
    removeUser: (state) => {
      state = {};
      return state;
    },
  },
});

export const { setuser, removeUser } = userSlice.actions;

export default userSlice.reducer;
