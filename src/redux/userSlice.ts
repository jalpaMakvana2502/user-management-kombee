import { createSlice } from "@reduxjs/toolkit";
import { IRole, IUser } from "../types/user";

interface IUsersState {
  rolesLoading: boolean;
  rolesList: IRole[];
  usersList: IUser[];
  userTableSearch: string;
  userTableFilter: string; // if we have mutiple filters then can have object
  userTableSort: {
    sort: string;
    orderBy: "asc" | "desc";
  };
  userTablePagination: {
    page: number;
    rowsPerPage: number;
    total: number;
  };
  selectedUsers: string[];
  refreshRef: string;
}

const initialState: IUsersState = {
  rolesLoading: false,
  rolesList: [],
  usersList: [],
  userTableSearch: "",
  userTableFilter: "",
  userTablePagination: {
    page: 1,
    rowsPerPage: 5,
    total: 0,
  },
  userTableSort: {
    orderBy: "asc",
    sort: "",
  },
  selectedUsers: [],
  refreshRef: Math.random().toString(),
};

export const usersSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSelectedUsers(state, action) {
      state.selectedUsers = action.payload;
    },
    setUsersList(state, action) {
      state.usersList = action.payload;
    },
    setUserSearch(state, action) {
      state.userTableSearch = action.payload;
    },
    setUserFilter(state, action) {
      state.userTableFilter = action.payload;
    },
    setUserPagination(state, action) {
      state.userTablePagination = {
        ...state.userTablePagination,
        ...action.payload,
      };
    },
    setUserSort(state, action) {
      state.userTableSort = { ...state.userTableSort, ...action.payload };
    },
    refreshUserTable(state) {
      state.refreshRef = Math.random().toString();
    },
    setRolesLoading(state, action) {
      state.rolesLoading = action.payload;
    },
    setRolesList(state, action) {
      state.rolesList = action.payload;
    },
  },
});

export const {
  setUsersList,
  setUserSearch,
  setUserFilter,
  setUserPagination,
  setUserSort,
  setSelectedUsers,
  refreshUserTable,
  setRolesLoading,
  setRolesList,
} = usersSlice.actions;
export default usersSlice.reducer;
