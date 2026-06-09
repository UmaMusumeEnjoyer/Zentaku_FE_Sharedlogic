import { apiClient } from '../api/apiClient';
import type { WatchRoom } from '../features/watchAlong/types/watchAlong.types';

const pendingLeaves = new Map<string, ReturnType<typeof setTimeout>>();

export const watchPartyService = {
  createWatchRoom: async (data: { channelId?: string; mediaId?: string; currentSourceUrl?: string; settings?: any }) => {
    const response = await apiClient.post('/watch-rooms', data);
    return response.data;
  },
  
  getWatchRoom: async (channelId: string) => {
    const response = await apiClient.get(`/watch-rooms/${channelId}`);
    return response.data;
  },

  updatePlaybackState: async (channelId: string, data: { action: 'play' | 'pause' | 'seek'; timestamp?: number }) => {
    const response = await apiClient.patch(`/watch-rooms/${channelId}/state`, data);
    return response.data;
  },

  joinWatchRoom: async (channelId: string) => {
    if (pendingLeaves.has(channelId)) {
      clearTimeout(pendingLeaves.get(channelId)!);
      pendingLeaves.delete(channelId);
    }
    const response = await apiClient.post(`/watch-rooms/${channelId}/join`);
    return response.data;
  },

  leaveWatchRoom: async (channelId: string) => {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(async () => {
        pendingLeaves.delete(channelId);
        try {
          const response = await apiClient.post(`/watch-rooms/${channelId}/leave`);
          resolve(response.data);
        } catch (error) {
          reject(error);
        }
      }, 500); // 500ms delay to prevent Strict Mode unmount/remount issues
      pendingLeaves.set(channelId, timeoutId);
    });
  }
};
