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

  /**
   * Lấy danh sách thành viên của một cộng đồng
   * GET /communities/{communityId}/members
   */
  getCommunityMembers: (communityId: string | number) => {
    return apiClient.get(`/communities/${communityId}/members`);
  },

  /**
   * Toggle mute cho một cộng đồng
   * POST /communities/{communityId}/mute
   */
  toggleMuteCommunity: (communityId: string | number, isMuted: boolean) => {
    return apiClient.post(`/communities/${communityId}/mute`, { isMuted });
  },

  // ===========================
  // PRIVATE CHANNELS (DMs)
  // ===========================

  /**
   * Lấy danh sách các cuộc trò chuyện riêng tư
   * GET /channels/private
   */
  getPrivateChannels: () => {
    return apiClient.get('/channels/private');
  },

  /**
   * Tạo hoặc lấy private channel với một user
   * POST /channels/private
   */
  createOrGetPrivateChannel: (recipientId: string | number) => {
    return apiClient.post('/channels/private', { recipientId });
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
   * PATCH /channels/{channelId}/read-cursor
   */
  updateReadCursor: (channelId: string | number, data: any) => {
    return apiClient.patch(`/channels/${channelId}/read-cursor`, data);
  },
};
