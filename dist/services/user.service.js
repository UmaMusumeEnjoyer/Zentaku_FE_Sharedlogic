var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { apiClient, getCached, setCached, TTL_SHORT } from '../api/apiClient';
export const userService = {
    // --- Profile ---
    getUserProfile: (username) => {
        return apiClient.get(`/user/${username}/profile/`);
    },
    updateUserProfile: (userData) => {
        return apiClient.put('/user/profile/update/', userData);
    },
    uploadAvatar: (file) => {
        const formData = new FormData();
        // Lưu ý: React Native xử lý file hơi khác Web, nhưng FormData là chuẩn chung
        formData.append('avatar', file);
        return apiClient.post('/user/avatar/upload/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    // --- Tracking / Follow ---
    updateAnimeStatus: (animeId, data) => {
        return apiClient.post(`/follow/${animeId}/create/`, data);
    },
    getAnimeStatus: (animeId) => {
        return apiClient.get(`/follow/${animeId}/get`);
    },
    deleteAnimeStatus: (animeId) => {
        return apiClient.delete(`/follow/${animeId}/delete/`);
    },
    // --- Stats (Heatmap/Activity) ---
    getHeatmap: (username) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `user:${username}:heatmap`;
        const cached = getCached(key);
        if (cached)
            return { data: cached };
        const res = yield apiClient.get(`/user/${username}/overview/heatmap`);
        setCached(key, res.data, TTL_SHORT);
        return res;
    }),
    searchUsers: (keyword) => {
        return apiClient.get('/user/search/', {
            params: { q: keyword }
        });
    },
    getUserActivity: (username) => __awaiter(void 0, void 0, void 0, function* () {
        const key = `user:${username}:activity`;
        const cached = getCached(key);
        if (cached)
            return { data: cached };
        const res = yield apiClient.get(`/user/${username}/overview/activity`);
        setCached(key, res.data, TTL_SHORT); // Cache 5 phút
        return res;
    }),
};
//# sourceMappingURL=user.service.js.map