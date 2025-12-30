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
// --- CACHING UTILITIES (Giữ nguyên logic cũ nhưng viết lại gọn hơn) ---
const simpleCache = {};
export const TTL_DEFAULT = 1000 * 60 * 20; // 20 phút
export const TTL_SHORT = 1000 * 60 * 5; // 5 phút
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
// Cập nhật baseURL nếu config thay đổi (dynamic injection)
apiClient.interceptors.request.use((config) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Cập nhật BaseURL nếu chưa đúng
    if (SharedConfig.apiBaseUrl && config.baseURL !== SharedConfig.apiBaseUrl) {
        config.baseURL = SharedConfig.apiBaseUrl;
    }
    // 2. Lấy Token từ Storage (Hỗ trợ cả Async của Mobile)
    if (SharedConfig.storage) {
        const token = yield SharedConfig.storage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}), (error) => Promise.reject(error));
//# sourceMappingURL=apiClient.js.map