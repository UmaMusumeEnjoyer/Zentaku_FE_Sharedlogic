import { apiClient } from '../api/apiClient';

// ====================================================================
// ADMIN SERVICE - Zentaku_BE Admin Operations
// ====================================================================

export interface UploadEpisodePayload {
  animeId: number;
  episodeNumber: number;
  videoFile?: File;
  subtitleFile?: File;
  onUploadProgress?: (progressEvent: { loaded: number; total?: number }) => void;
}

export interface UploadEpisodeResult {
  animeId: number;
  episodeNumber: string;
  uploadSuccess: boolean;
  conversionStatus: string;
  message: string;
}

export interface FilmServerEpisode {
  episodeNumber: string;
  hasHls: boolean;
  hasSubtitle: boolean;
  files: string[];
}

export const adminService = {
  /**
   * Upload video and subtitle for an anime episode
   */
  uploadEpisode: async (payload: UploadEpisodePayload): Promise<UploadEpisodeResult> => {
    const formData = new FormData();
    formData.append('animeId', String(payload.animeId));
    formData.append('episodeNumber', String(payload.episodeNumber));

    if (payload.videoFile) {
      formData.append('video', payload.videoFile);
    }
    if (payload.subtitleFile) {
      formData.append('subtitle', payload.subtitleFile);
    }

    const res = await apiClient.post('/admin/movies/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: payload.onUploadProgress,
      timeout: 600000, // 10 minutes
    });

    return res.data;
  },

  /**
   * Get all movies from FilmServer
   */
  getMovies: async (): Promise<Record<number, number>> => {
    const res = await apiClient.get('/admin/movies');
    return res.data;
  },

  /**
   * Get episodes for a specific anime from FilmServer
   */
  getEpisodes: async (animeId: number): Promise<FilmServerEpisode[]> => {
    const res = await apiClient.get(`/admin/movies/${animeId}/episodes`);
    return res.data;
  },

  /**
   * Delete an episode completely from FilmServer
   */
  deleteEpisode: async (animeId: number, episodeNumber: number): Promise<void> => {
    await apiClient.delete(`/admin/movies/${animeId}/${episodeNumber}`);
  },

  /**
   * Get active conversion status
   */
  getConversionStatus: async (): Promise<Record<string, unknown>> => {
    const res = await apiClient.get('/admin/movies/conversion-status');
    return res.data;
  },

  /**
   * Get basic anime info by AniList ID
   */
  getAnimeBasicInfo: async (anilistId: number): Promise<any> => {
    const res = await apiClient.get(`/anilist/anime/${anilistId}`);
    return res.data;
  },

  /**
   * Search anime from AniList API (via Zentaku_BE search endpoint)
   */
  searchAnime: async (query: string, page = 1, perPage = 10): Promise<any> => {
    const res = await apiClient.get('/search/anime', {
      params: { q: query, page, perPage },
    });
    return res.data;
  },
};
