import { apiClient } from '../api/apiClient';

export interface SearchQueryParams {
  q?: string;
  genres?: string; // comma separated
  year?: number | string;
  season?: string;
  format?: string;
  status?: string;
  sort?: string;
  page?: number;
  perPage?: number;
  isAdult?: boolean;
}

export const searchService = {
  /**
   * Tìm kiếm Anime tổng hợp (theo tên hoặc tiêu chí)
   * GET /search/anime
   */
  searchAnime: (params: SearchQueryParams) => {
    return apiClient.get('/search/anime', { params });
  },

  /**
   * Tìm kiếm Manga
   * GET /search/manga
   */
  searchManga: (params: SearchQueryParams) => {
    return apiClient.get('/search/manga', { params });
  },

  /**
   * Tìm kiếm Light Novel
   * GET /search/novel
   */
  searchNovel: (params: SearchQueryParams) => {
    return apiClient.get('/search/novel', { params });
  },

  /**
   * Tìm kiếm chung toàn hệ thống (Global Search)
   * GET /search
   */
  searchAll: (q: string) => {
    return apiClient.get('/search', { params: { q } });
  },

  /**
   * Lấy danh sách Trending
   * GET /search/trending
   */
  getTrending: (type?: string, page?: number, perPage?: number) => {
    return apiClient.get('/search/trending', { 
      params: { type, page, perPage } 
    });
  },

  /**
   * Lấy danh sách Popular (All-time)
   * GET /search/popular
   */
  getPopular: (page?: number, perPage?: number) => {
    return apiClient.get('/search/popular', { 
      params: { page, perPage } 
    });
  },

  /**
   * Lấy danh sách theo mùa cụ thể
   * GET /search/seasonal
   */
  getSeasonal: (year: number, season: string, page?: number, perPage?: number) => {
    return apiClient.get('/search/seasonal', { 
      params: { year, season, page, perPage } 
    });
  },

  /**
   * Lấy danh sách mùa hiện tại
   * GET /search/seasonal/current
   */
  getCurrentSeasonal: (page?: number, perPage?: number) => {
    return apiClient.get('/search/seasonal/current', { 
      params: { page, perPage } 
    });
  },

  /**
   * Lấy danh sách mùa tiếp theo
   * GET /search/seasonal/next
   */
  getNextSeasonal: (page?: number, perPage?: number) => {
    return apiClient.get('/search/seasonal/next', { 
      params: { page, perPage } 
    });
  }
};
