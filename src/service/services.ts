import axios from "axios";
import { API_BASE_URL, axiosConfig } from "./httpService";

export const loginUser = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post(`${API_BASE_URL}login`, formData);
    console.log("Login response:", res);
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const fetchAllUser = async (
  search?: string,
  sort?: string,
  page?: number,
  rowsPerPage?: number
) => {
  try {
    const res = await axiosConfig.get(
      `${API_BASE_URL}users?search=${search}&sort=${sort}&per_page=${rowsPerPage}&page=${page}&order_by=asc`
    );
    console.log("Fetched users:", res);
    return res.data;
  } catch (error) {
    console.error("Fetch users error:", error);
    throw error;
  }
};

export const fetchUserById = async (userId: any) => {
  try {
    const res = await axiosConfig.get(`${API_BASE_URL}users/${userId}`);
    console.log("Fetched user:", res);
    return res.data;
  } catch (error) {
    console.error("Fetch user error:", error);
    throw error;
  }
};

export const createUser = async (userData: any) => {
  try {
    const res = await axiosConfig.post(`${API_BASE_URL}users`, userData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Created user:", res);
    return res.data;
  } catch (error) {
    console.error("Create user error:", error);
    throw error;
  }
};

export const updateUserById = async (userId: any, userData: any) => {
  try {
    const res = await axiosConfig.post(
      `${API_BASE_URL}users/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Updated user:", res);
    return res.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};

export const deleteUserById = async (userId: any) => {
  try {
    const res = await axiosConfig.delete(`${API_BASE_URL}users/${userId}`);
    console.log("Deleted user:", res);
    return res.data;
  } catch (error) {
    console.error("Delete user error:", error);
    throw error;
  }
};

export const deleteMultipleUsers = async (userId: any) => {
  try {
    const res = await axiosConfig.post(
      `${API_BASE_URL}users-delete-multiple`,
      userId
    );
    console.log("Deleted multiple users:", res);
    return res.data;
  } catch (error) {
    console.error("Delete multiple users error:", error);
    throw error;
  }
};
