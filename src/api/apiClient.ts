import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';
import { SharedConfig } from './config';

// --- CACHING UTILITIES (Giữ nguyên) ---
const simpleCache: Record<string, { val: any; exp: number }> = {};
export const TTL_DEFAULT = 1000 * 60 * 20;
export const TTL_SHORT = 1000 * 60 * 5;

export function getCached<T>(key: string): T | null {
  const entry = simpleCache[key];
  if (!entry) return null;
  if (Date.now() > entry.exp) {
    delete simpleCache[key];
    return null;
  }
  return entry.val;
}

export function setCached(key: string, val: any, ttl = TTL_DEFAULT) {
  simpleCache[key] = { val, exp: Date.now() + ttl };
}

// --- AXIOS INSTANCE ---
export const apiClient = axios.create({
  baseURL: SharedConfig.apiBaseUrl,
});

// Biến để tránh refresh nhiều lần đồng thời
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // 1. Cập nhật BaseURL nếu chưa đúng
  if (SharedConfig.apiBaseUrl && config.baseURL !== SharedConfig.apiBaseUrl) {
    config.baseURL = SharedConfig.apiBaseUrl;
  }

  // 2. Lấy Token từ Storage
  if (SharedConfig.storage) {
    const token = await SharedConfig.storage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
}, (error) => Promise.reject(error));

// Response interceptor - Tự động refresh token khi 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Kiểm tra nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, đợi và retry với token mới
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = SharedConfig.storage 
          ? await SharedConfig.storage.getItem('refreshToken')
          : localStorage.getItem('refreshToken');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Gọi API refresh
        const response = await axios.post(
          `${SharedConfig.apiBaseUrl}/auth/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccessToken = response.data.access;
        const newRefreshToken = response.data.refresh;

        // Lưu token mới
        if (SharedConfig.storage) {
          await SharedConfig.storage.setItem('authToken', newAccessToken);
          if (newRefreshToken) {
            await SharedConfig.storage.setItem('refreshToken', newRefreshToken);
          }
        } else {
          localStorage.setItem('authToken', newAccessToken);
          if (newRefreshToken) {
            localStorage.setItem('refreshToken', newRefreshToken);
          }
        }

        // Cập nhật header và retry các request đang chờ
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Xóa token và redirect về login
        if (SharedConfig.storage) {
          await SharedConfig.storage.removeItem('authToken');
          await SharedConfig.storage.removeItem('refreshToken');
          await SharedConfig.storage.removeItem('username');
        } else {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('username');
        }

        // Trigger logout (có thể dispatch event hoặc redirect)
        window.dispatchEvent(new Event('auth:logout'));
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);