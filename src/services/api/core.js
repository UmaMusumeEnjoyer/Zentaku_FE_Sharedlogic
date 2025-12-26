// shared-logic/src/services/api/core.js
import axios from 'axios';
import { clearCache } from '../../utils/apiCache'; // Import từ utils bên ngoài

// 1. Cấu hình biến môi trường
const DEFAULT_BASE_URL = 
  process.env.REACT_APP_API_URL || 
  process.env.EXPO_PUBLIC_API_URL || 
  'https://doannguyen.pythonanywhere.com/api';

let authToken = null;

// 2. Khởi tạo Axios Instance
export const axiosInstance = axios.create({
  baseURL: DEFAULT_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// 3. Các hàm quản lý Config
export const setBaseUrl = (url) => {
  axiosInstance.defaults.baseURL = url;
};

export const setAuthToken = (token) => {
  authToken = token;
};

export const logoutAPI = () => {
    authToken = null;
    clearCache();
};

// 4. Interceptor
axiosInstance.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
}, (error) => Promise.reject(error));