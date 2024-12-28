import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  usersList: any[];
  user: any;
}

const initialState: UserState = {
  usersList: [],
  user: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUserList(state, action) {
      console.log("Payload", action.payload);
      state.usersList = action.payload;
      console.log("New State:", state);
    },
    createUpdateUser(state, action) {
      console.log("Payload:", action.payload);
      state.user = action.payload;
    },
    deleteUser(state, action) {
      state.usersList = state.usersList.filter(
        (user) => user.id !== action.payload
      );
    },
    deleteMultipleUser(state, action) {
      state.usersList = state.usersList.filter(
        (user) => !action.payload.includes(user.id)
      );
    },
  },
});

export const {
  getUserList,
  createUpdateUser,
  deleteUser,
  deleteMultipleUser,
} = userSlice.actions;
export default userSlice.reducer;
