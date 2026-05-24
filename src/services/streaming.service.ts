// shared-logic/src/services/streaming.service.ts
import { apiClient } from '../api/apiClient';

export const streamingService = {
  /**
   * Lấy danh sách tập phim của một anime
   * GET /streaming/{anilistId}/episodes
   */
  getEpisodes: (anilistId: string | number) => {
    return apiClient.get(`/streaming/${anilistId}/episodes`);
  },

  /**
   * Lấy link nguồn (m3u8, iframe, v.v.) của một tập phim cụ thể
   * GET /streaming/{anilistId}/episodes/{episodeNumber}/sources
   */
  getEpisodeSources: (anilistId: string | number, episodeNumber: number) => {
    return apiClient.get(`/streaming/${anilistId}/episodes/${episodeNumber}/sources`);
  },

  /**
   * Đồng bộ dữ liệu tập phim mới nhất cho anime
   * POST /streaming/{anilistId}/sync
   */
  syncStreaming: (anilistId: string | number) => {
    return apiClient.post(`/streaming/${anilistId}/sync`);
  },

  /**
   * Lấy trạng thái của một background task (vd: sync streaming)
   * GET /streaming/tasks/{taskId}
   */
  getTaskStatus: (taskId: string) => {
    return apiClient.get(`/streaming/tasks/${taskId}`);
  },
};
