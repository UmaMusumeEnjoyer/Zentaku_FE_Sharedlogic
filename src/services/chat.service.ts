// shared-logic/src/services/chat.service.ts
import { apiClient } from '../api/apiClient';

export const chatService = {
  // ===========================
  // COMMUNITY & CHANNELS
  // ===========================

  /**
   * Lấy danh sách các cộng đồng (communities)
   * GET /communities
   */
  getCommunities: () => {
    return apiClient.get('/communities');
  },

  /**
   * Lấy danh sách các kênh (channels) thuộc một cộng đồng cụ thể
   * GET /communities/{communityId}/channels
   */
  getCommunityChannels: (communityId: string | number) => {
    return apiClient.get(`/communities/${communityId}/channels`);
  },

  // ===========================
  // MESSAGES
  // ===========================

  /**
   * Lấy danh sách tin nhắn trong một channel
   * GET /channels/{channelId}/messages
   */
  getChannelMessages: (channelId: string | number, params?: any) => {
    // Có thể truyền thêm params như limit, before, after...
    return apiClient.get(`/channels/${channelId}/messages`, { params });
  },

  /**
   * Gửi tin nhắn mới vào một channel
   * POST /channels/{channelId}/messages
   */
  sendMessage: (channelId: string | number, data: any) => {
    return apiClient.post(`/channels/${channelId}/messages`, data);
  },

  /**
   * Cập nhật trạng thái đã đọc (read cursor) trong một channel
   * POST /channels/{channelId}/read-cursor
   */
  updateReadCursor: (channelId: string | number, data: any) => {
    return apiClient.post(`/channels/${channelId}/read-cursor`, data);
  },
};
