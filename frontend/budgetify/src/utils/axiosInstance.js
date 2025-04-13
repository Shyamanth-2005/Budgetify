import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// request
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);
// response
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        window.location.href = "/login";
      } else if (err.response.status === 500) {
        console.error("Server Error. Please Try Again Later...");
      }
    } else if (err.code === "ECONNABORTED") {
      console.error("Request Timeout. Please Try Again...");
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
