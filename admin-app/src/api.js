import axios from 'axios';

const API = axios.create({
  baseURL: 'https://byepo-feature-flags.onrender.com/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/org-admin/login')) {
      localStorage.removeItem('adminToken');
      window.location.href = '/';
    }

    return Promise.reject(error);
  }
);

export default API;