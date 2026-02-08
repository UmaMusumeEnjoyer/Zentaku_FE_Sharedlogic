import { apiClient, getCached, setCached, TTL_SHORT } from '../api/apiClient';
import { User } from '../features/authPage/auth.types';
const animeStatusCache = new Map<string | number, any>();
const pendingRequests = new Map<string | number, Promise<any>>();
export const userService = {
  
  // --- Profile ---
  getUserProfile: (username: string) => {
    return apiClient.get<User>(`/user/${username}/profile/`);
  },

  updateUserProfile: (userData: Partial<User>) => {
    return apiClient.put<{ user: User } | User>('/user/profile/update/', userData);
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
  updateAnimeStatus: (animeId: number | string, data: any) => {
    const cacheKey = `anime_status_${animeId}`;
    animeStatusCache.delete(cacheKey);
    
    return apiClient.post(`/follow/${animeId}/create/`, data);
  },
  
  getAnimeStatus: async (animeId: number | string) => {
    const cacheKey = `anime_status_${animeId}`;
    

    if (animeStatusCache.has(cacheKey)) {
      const cachedData = animeStatusCache.get(cacheKey);
      const now = Date.now();
      
      if (cachedData.timestamp && now - cachedData.timestamp < TTL_SHORT) {
        console.log('📦 [Cache HIT] Returning cached anime status for:', animeId);
        return cachedData.response;
      } else {
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
  },

  deleteAnimeStatus: (animeId: number | string) => {
    const cacheKey = `anime_status_${animeId}`;
    animeStatusCache.delete(cacheKey);
    
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

  getUserActivity: async (username: string) => {
  const key = `user:${username}:activity`;
  const cached = getCached(key);
  if (cached) return{ data: cached };

  const res = await apiClient.get(`/user/${username}/overview/activity`)
    setCached(key, res.data, TTL_SHORT); // Cache 5 phút
    return res;
  },

  getUserAnimeList : (username: string) => {
  // KHÔNG CACHE: List thay đổi thường xuyên khi user update
  return apiClient.get(`/user/${username}/animelist`);
  },

  deleteUserAvatar : () => {
  return apiClient.delete('/user/avatar/delete/');
  },

};