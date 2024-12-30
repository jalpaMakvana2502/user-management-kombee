import axios from "axios";
import { API_BASE_URL, axiosConfig } from "./httpService";

export const loginUser = async (formData: {
  email: string;
  password: string;
}) => {
  try {
    const res = await axios.post(`${API_BASE_URL}login`, formData);
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const fetchAllUser = async (
  search: string,
  filter: string,
  sort: string,
  orderBy: string,
  page?: number,
  rowsPerPage?: number
) => {
  try {
    const filterStr = filter ? btoa(JSON.stringify({ role_id: [filter] })) : "";
    const res = await axiosConfig.get(
      `${API_BASE_URL}users?search=${search}&sort=${sort}&per_page=${rowsPerPage}&page=${page}&order_by=${orderBy}&filter=${filterStr}`
    );
    return res.data;
  } catch (error) {
    console.error("Fetch users error:", error);
    throw error;
  }
};

export const fetchUserById = async (userId: any) => {
  try {
    const res = await axiosConfig.get(`${API_BASE_URL}users/${userId}`);
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
    return res.data;
  } catch (error) {
    console.error("Update user error:", error);
    throw error;
  }
};

export const deleteUserById = async (userId: any) => {
  try {
    const res = await axiosConfig.delete(`${API_BASE_URL}users/${userId}`);
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
    return res.data;
  } catch (error) {
    console.error("Delete multiple users error:", error);
    throw error;
  }
};

export const getRoles = async () => {
  try {
    const res = await axiosConfig.get(
      `/roles?page=1&per_page=&filter=&search=&is_light=&sort=&order_by=`
    );
    return res.data.data;
  } catch (error) {
    console.error("Fetch user error:", error);
    throw error;
  }
};

export const exportUsers = async (
  search: string = "",
  filter: string = "",
  sort: string = "",
  orderBy: string = "asc"
) => {
  try {
    const filterStr = filter ? btoa(JSON.stringify({ role_id: [filter] })) : "";

    const params = {
      search: search,
      sort: sort,
      page: 1,
      order_by: orderBy,
      filter: filterStr,
    };
    const res = await axiosConfig.get(`/users-export`, { params });
    return res.data;
  } catch (error) {
    console.error("Fetch users error:", error);
    throw error;
  }
};
