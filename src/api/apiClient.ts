import axios, { InternalAxiosRequestConfig } from 'axios';
import { SharedConfig } from './config';

// --- CACHING UTILITIES (Giữ nguyên logic cũ nhưng viết lại gọn hơn) ---
const simpleCache: Record<string, { val: any; exp: number }> = {};
export const TTL_DEFAULT = 1000 * 60 * 20; // 20 phút
export const TTL_SHORT = 1000 * 60 * 5;    // 5 phút

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

// Cập nhật baseURL nếu config thay đổi (dynamic injection)
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  // 1. Cập nhật BaseURL nếu chưa đúng
  if (SharedConfig.apiBaseUrl && config.baseURL !== SharedConfig.apiBaseUrl) {
    config.baseURL = SharedConfig.apiBaseUrl;
  }

  // 2. Lấy Token từ Storage (Hỗ trợ cả Async của Mobile)
  if (SharedConfig.storage) {
    const token = await SharedConfig.storage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
}, (error) => Promise.reject(error));