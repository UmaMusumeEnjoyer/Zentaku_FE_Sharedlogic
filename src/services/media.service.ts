// shared-logic/src/services/media.service.ts
import { apiClient } from '../api/apiClient';

export const mediaService = {
  // ===========================
  // MANGA READING SERVICE
  // ===========================

  /**
   * Lấy thông tin chi tiết manga từ provider đọc truyện
   */
  getMangaDetails: (anilistId: string | number) => {
    return apiClient.get(`/manga/${anilistId}`);
  },

  /**
   * Lấy danh sách chapters của manga
   */
  getMangaChapters: (anilistId: string | number) => {
    return apiClient.get(`/manga/${anilistId}/chapters`);
  },

  /**
   * Lấy hình ảnh (pages) của một chapter manga cụ thể
   */
  getMangaChapterPages: (anilistId: string | number, chapterId: string) => {
    return apiClient.get(`/manga/${anilistId}/chapters/${chapterId}/pages`);
  },

  // ===========================
  // LIGHT NOVEL READING SERVICE
  // ===========================

  /**
   * Lấy thông tin chi tiết light novel từ provider đọc truyện
   */
  getNovelDetails: (anilistId: string | number) => {
    return apiClient.get(`/novel/${anilistId}`);
  },

  /**
   * Lấy danh sách chapters của light novel
   */
  getNovelChapters: (anilistId: string | number) => {
    return apiClient.get(`/novel/${anilistId}/chapters`);
  },

  /**
   * Lấy nội dung chữ (content) của một chapter novel cụ thể
   */
  getNovelChapterContent: (anilistId: string | number, chapterId: string) => {
    return apiClient.get(`/novel/${anilistId}/chapters/${chapterId}/content`);
  },
};
