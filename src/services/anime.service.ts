import { apiClient, getCached, setCached, TTL_DEFAULT } from '../api/apiClient';

// ====================================================================
// ANIME SERVICE - Zentaku_BE
// ====================================================================

export const animeService = {
  // --- ANIME DETAIL ---
  getById: async (id: number | string): Promise<any> => {
    const key = `anime:${id}:detail`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/anilist/anime/${id}`);
    setCached(key, res.data, TTL_DEFAULT);
    return res;
  },

  // --- OVERVIEW ---
  getOverview: async (id: number | string): Promise<any> => {
    const key = `anime:${id}:overview`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/anilist/anime/${id}/overview`);
    setCached(key, res.data, TTL_DEFAULT);
    return res;
  },

  // --- CHARACTERS ---
  getCharacters: async (id: number | string, page: number = 1, perPage: number = 25): Promise<any> => {
    const key = `anime:${id}:characters:${page}:${perPage}`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/anilist/anime/${id}/characters`, {
      params: { page, perPage }
    });
    setCached(key, res.data, TTL_DEFAULT);
    return res;
  },

  // --- STAFF ---
  getAnimeStaff: async (id: number | string, page: number = 1, perPage: number = 25): Promise<any> => {
    const key = `anime:${id}:staff:${page}:${perPage}`;
    const cached = getCached(key);
    if (cached) return { data: cached };
    
    const res = await apiClient.get(`/anilist/anime/${id}/staff`, {
      params: { page, perPage }
    });
    setCached(key, res.data, TTL_DEFAULT);
    return res;
  },

  getTrendingAnime: async (page = 1, perPage = 10, season?: string, year?: number, type: 'ANIME' | 'MANGA' | 'NOVEL' = 'ANIME'): Promise<any> => {
    let url = `/search/trending?page=${page}&perPage=${perPage}&type=${type}`;
    if (season && year) {
      url += `&season=${season}&year=${year}`;
    }
    return apiClient.get(url);
  },

  getAnimeSchedule: async (start?: number, end?: number): Promise<any> => {
    let url = `/schedule`;
    const params = new URLSearchParams();
    if (start) params.append('start', start.toString());
    if (end) params.append('end', end.toString());
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    return apiClient.get(url);
  },

  // --- STATS ---
  getAnimeStats: async (id: number | string): Promise<any> => {
    const key = `anime:${id}:stats`;
    const cached = getCached(key);
    if (cached) return Promise.resolve({ data: cached });

    const res = await apiClient.get(`/anilist/anime/${id}/stats`);
    setCached(key, res.data, TTL_DEFAULT);
    return res;
  },

  // --- WHERE TO WATCH ---
  getWhereToWatch: async (id: number | string): Promise<any> => {
    const key = `anime:${id}:watch`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/anilist/anime/${id}/watch`);
    setCached(key, res.data, TTL_DEFAULT);
    return res;
  },

  // ====================================================================
  // API ĐÃ XÓA BỎ / DEPRECATED
  // ====================================================================

  getAnimeCharacter: async (id: number | string): Promise<any> => {
    const key = `character:${id}:detail`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/anilist/character/${id}`);
    setCached(key, res.data, TTL_DEFAULT);
    return res;
  },

  getStaffById: async (id: number | string): Promise<any> => {
    const key = `staff:${id}:detail`;
    const cached = getCached(key);
    if (cached) return { data: cached };

    const res = await apiClient.get(`/anilist/staff/${id}`);
    setCached(key, res.data, TTL_DEFAULT);
    return res;
  }
};