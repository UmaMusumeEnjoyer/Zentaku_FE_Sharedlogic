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
const animeStatusCache = new Map();
const pendingRequests = new Map();
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
        const cacheKey = `anime_status_${animeId}`;
        animeStatusCache.delete(cacheKey);
        return apiClient.post(`/follow/${animeId}/create/`, data);
    },
    getAnimeStatus: (animeId) => __awaiter(void 0, void 0, void 0, function* () {
        const cacheKey = `anime_status_${animeId}`;
        if (animeStatusCache.has(cacheKey)) {
            const cachedData = animeStatusCache.get(cacheKey);
            const now = Date.now();
            if (cachedData.timestamp && now - cachedData.timestamp < TTL_SHORT) {
                console.log('📦 [Cache HIT] Returning cached anime status for:', animeId);
                return cachedData.response;
            }
            else {
                // Cache hết hạn
                animeStatusCache.delete(cacheKey);
            }
        }
        if (pendingRequests.has(cacheKey)) {
            console.log('⏳ [Dedup] Request already pending for:', animeId);
            return pendingRequests.get(cacheKey);
        }
        console.log('🚀 [New Request] Fetching anime status for:', animeId);
        const requestPromise = apiClient.get(`/follow/${animeId}/get`)
            .then(response => {
            animeStatusCache.set(cacheKey, {
                response,
                timestamp: Date.now()
            });
            pendingRequests.delete(cacheKey);
            return response;
        })
            .catch(error => {
            pendingRequests.delete(cacheKey);
            throw error;
        });
        pendingRequests.set(cacheKey, requestPromise);
        return requestPromise;
    }),
    deleteAnimeStatus: (animeId) => {
        const cacheKey = `anime_status_${animeId}`;
        animeStatusCache.delete(cacheKey);
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
    getUserAnimeList: (username) => {
        // KHÔNG CACHE: List thay đổi thường xuyên khi user update
        return apiClient.get(`/user/${username}/animelist`);
    },
    deleteUserAvatar: () => {
        return apiClient.delete('/user/avatar/delete/');
    },
};
//# sourceMappingURL=user.service.js.map