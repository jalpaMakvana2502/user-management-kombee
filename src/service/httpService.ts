import axios from "axios";
import { retrieveToken } from "../utils/utils";

export const API_BASE_URL = "https://interview.optimavaluepro.com/api/v1/";

export const axiosConfig = axios.create({
  baseURL: API_BASE_URL,
});

axiosConfig.interceptors.request.use(
  (requestConfig) => {
    const authToken = retrieveToken();
    if (authToken) {
      requestConfig.headers.Authorization = `Bearer ${authToken}`;
    }
    return requestConfig;
  },
  (requestError) => {
    console.error("Request error:", requestError);
    return Promise.reject(requestError);
  }
);
