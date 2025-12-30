import { apiClient, getCached, setCached, TTL_SHORT } from '../core/apiClient';

export const userService = {
  // --- Profile ---
  getProfile: (username: string) => {
    return apiClient.get(`/user/${username}/profile/`);
  },

  updateProfile: (userData: any) => {
    return apiClient.put('/user/profile/update/', userData);
  },

  uploadAvatar: (file: any) => {
    const formData = new FormData();
    // Lưu ý: React Native xử lý file hơi khác Web, nhưng FormData là chuẩn chung
    formData.append('avatar', file); 
    return apiClient.post('/user/avatar/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // --- Tracking / Follow ---
  updateAnimeStatus: (animeId: string, data: any) => {
    return apiClient.post(`/follow/${animeId}/create/`, data);
  },
  
  getAnimeStatus: (animeId: string) => {
    return apiClient.get(`/follow/${animeId}/get`);
  },

  // --- Stats (Heatmap/Activity) ---
  getHeatmap: async (username: string) => {
    const key = `user:${username}:heatmap`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/user/${username}/overview/heatmap`);
    setCached(key, res.data, TTL_SHORT);
    return res;
  }
};