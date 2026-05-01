import axios from 'axios';
import { toast } from 'react-toastify';

// Use your backend URL
const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    if (error.response?.status !== 404) {
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api;