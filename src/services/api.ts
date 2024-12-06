import axios from "axios";
import { useAuthStore } from "../store/authStore";


const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
      const user = useAuthStore.getState().user;
      if (user) {
          config.headers['X-User-Role'] = user.role;
          if (user.username) {
              config.headers['X-User-Id'] = user.username;
          }
          config.headers['X-User-Id'] = user.nombre;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
      if (error.response?.status === 401) {
                  useAuthStore.getState().logout();
          window.location.href = '/login';
      }
      return Promise.reject(error);
  }
);


export default api;