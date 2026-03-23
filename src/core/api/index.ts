import axios from "axios";

export const api = axios.create({
  baseURL: "https://localhost:7101/api", // Adjust this when backend URL is known
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject({
      IsSuccess: false,
      ErrorMessage: "حدث خطأ في الشبكة أو الخادم",
      Errors: [],
      Data: null,
    });
  },
);
