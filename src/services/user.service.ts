import { apiClient, getCached, setCached, TTL_SHORT } from '../api/apiClient';
import { User } from '../features/authPage/auth.types';

export const userService = {
  // --- Profile ---
  getUserProfile: (username: string) => {
    return apiClient.get<User>(`/user/${username}/profile/`);
  },

  updateUserProfile: (userData: Partial<User>) => {
    return apiClient.put<User>('/user/profile/update/', userData);
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

  deleteAnimeStatus: (animeId: string) => {
  return apiClient.delete(`/follow/${animeId}/delete/`);
  },

  // --- Stats (Heatmap/Activity) ---
  getHeatmap: async (username: string) => {
    const key = `user:${username}:heatmap`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/user/${username}/overview/heatmap`);
    setCached(key, res.data, TTL_SHORT);
    return res;
  },

  searchUsers: (keyword: string) => {
    return apiClient.get('/user/search/', { 
      params: { q: keyword } 
    });
  },
};