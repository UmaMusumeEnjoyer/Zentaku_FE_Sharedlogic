import { apiClient, getCached, setCached, TTL_DEFAULT } from '../api/apiClient';

export const animeService = {
  getById: async (id: number | string) => {
    const key = `anime:${id}:detail`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/anilist/anime/${id}/`);
    setCached(key, res.data);
    return res;
  },

  getCharacters: async (id: number | string) => {
    const key = `anime:${id}:characters`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/anilist/anime/${id}/characters/`);
    setCached(key, res.data);
    return res;
  },

  getOverview: async (id: number | string) => {
    const key = `anime:${id}:overview`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/anilist/anime/${id}/overview/`);
    setCached(key, res.data);
    return res;
  },

  searchByName: (keyword: string) => {
    return apiClient.post('/anilist/search/name/', { name: keyword, manual: true });
  },

  getTrending: async () => {
    const key = `search:trending`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get('/anilist/search/trending/');
    setCached(key, res.data);
    return res;
  },
  
  // ... Bạn có thể copy nốt các hàm getAnimeStaff, getAnimeStats vào đây tương tự
  getAnimeStaff: async (id: number | string) => {
    const key = `anime:${id}:staff`;
    const cached = getCached(key);
    if (cached) return { data: cached };
    
    const res = await apiClient.get(`/anilist/anime/${id}/staffs/`);
    setCached(key, res.data);
    return res;
  },

  getAnimeCharacter : async (id: number | string) => {
  const key = `character:${id}:detail`;
  const cached = getCached(key);
  if (cached) return { data: cached };

  const res = await apiClient.get(`/anilist/character/${id}/`);
    setCached(key, res.data);
    return res;
  },
  
};