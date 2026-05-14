import axios from 'axios';
import { Plus } from "lucide-react";
const api = axios.create({
  baseURL: 'http://localhost:8000', // Your FastAPI URL
});

// Automatically inject JWT token into requests[cite: 1]
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/v1/api/login', credentials),
  signup: (userData) => api.post('/v1/api/Signup', userData),
};

export const workspaceService = {
  getAll: () => api.get('/v2/workspace/allworkspace'),
  create: (data) => api.post('/v2/workspace/create_workspace', data),
};