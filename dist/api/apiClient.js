var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { SharedConfig } from './config';
// --- CACHING UTILITIES (Giữ nguyên) ---
const simpleCache = {};
export const TTL_DEFAULT = 1000 * 60 * 20;
export const TTL_SHORT = 1000 * 60 * 5;
export function getCached(key) {
    const entry = simpleCache[key];
    if (!entry)
        return null;
    if (Date.now() > entry.exp) {
        delete simpleCache[key];
        return null;
    }
    return entry.val;
}
export function setCached(key, val, ttl = TTL_DEFAULT) {
    simpleCache[key] = { val, exp: Date.now() + ttl };
}
// --- AXIOS INSTANCE ---
export const apiClient = axios.create({
    baseURL: SharedConfig.apiBaseUrl,
});
// Biến để tránh refresh nhiều lần đồng thời
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        }
        else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};
// Request interceptor
apiClient.interceptors.request.use((config) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Cập nhật BaseURL nếu chưa đúng
    if (SharedConfig.apiBaseUrl && config.baseURL !== SharedConfig.apiBaseUrl) {
        config.baseURL = SharedConfig.apiBaseUrl;
    }
    // 2. Lấy Token từ Storage
    if (SharedConfig.storage) {
        const token = yield SharedConfig.storage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}), (error) => Promise.reject(error));
// Response interceptor - Tự động refresh token khi 401
apiClient.interceptors.response.use((response) => response, (error) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const originalRequest = error.config;
    // Kiểm tra nếu lỗi 401 và chưa retry
    if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401 && !originalRequest._retry) {
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
                ? yield SharedConfig.storage.getItem('refreshToken')
                : localStorage.getItem('refreshToken');
            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            // Gọi API refresh
            const response = yield axios.post(`${SharedConfig.apiBaseUrl}/auth/token/refresh/`, { refresh: refreshToken });
            const newAccessToken = response.data.access;
            const newRefreshToken = response.data.refresh;
            // Lưu token mới
            if (SharedConfig.storage) {
                yield SharedConfig.storage.setItem('authToken', newAccessToken);
                if (newRefreshToken) {
                    yield SharedConfig.storage.setItem('refreshToken', newRefreshToken);
                }
            }
            else {
                localStorage.setItem('authToken', newAccessToken);
                if (newRefreshToken) {
                    localStorage.setItem('refreshToken', newRefreshToken);
                }
            }
            // Cập nhật header và retry các request đang chờ
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            processQueue(null, newAccessToken);
            return apiClient(originalRequest);
        }
        catch (refreshError) {
            processQueue(refreshError, null);
            // Xóa token và redirect về login
            if (SharedConfig.storage) {
                yield SharedConfig.storage.removeItem('authToken');
                yield SharedConfig.storage.removeItem('refreshToken');
                yield SharedConfig.storage.removeItem('username');
            }
            else {
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('username');
            }
            // Trigger logout (có thể dispatch event hoặc redirect)
            window.dispatchEvent(new Event('auth:logout'));
            return Promise.reject(refreshError);
        }
        finally {
            isRefreshing = false;
        }
    }
    return Promise.reject(error);
}));
//# sourceMappingURL=apiClient.js.map