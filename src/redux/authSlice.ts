import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") ?? null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess(state, action) {
      localStorage.setItem("token", action.payload);
      state.token = action.payload;
      state.error = null;
    },
    loginFailure(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      localStorage.removeItem("token");
      state.token = null;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;
