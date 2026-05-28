import { useState, useEffect, useCallback } from 'react';
import { watchPartyService } from '../../../services/watchParty.service';
import { socketService } from '../../../services/socket.service';
import { WATCH_ALONG_EVENTS } from '../constants/watchAlongConstants';
import type { WatchRoom } from '../types/watchAlong.types';

export const useWatchAlongLogic = (roomId: string, currentUserId: string | null) => {
  const [room, setRoom] = useState<WatchRoom | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [remotePlaybackState, setRemotePlaybackState] = useState<{
    isPlaying: boolean;
    currentTimestamp: number;
    updatedAt: number;
  } | null>(null);

  const isHost = room?.hostId === currentUserId;

  // Load room and join
  useEffect(() => {
    if (!roomId) return;

    let mounted = true;

    const initRoom = async () => {
      try {
        setIsLoading(true);
        // 1. Join room (which also gets the current snapshot)
        const roomData = await watchPartyService.joinWatchRoom(roomId);
        if (mounted) {
          setRoom(roomData);
          setRemotePlaybackState({
            isPlaying: roomData.isPlaying,
            currentTimestamp: roomData.currentTimestamp,
            updatedAt: Date.now(),
          });
        }
        
        // 2. Connect socket and join the Socket.IO room for broadcasts
        await socketService.connect();
        socketService.emit('room.join', { channelId: roomId });

      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Failed to join watch room');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initRoom();

    return () => {
      mounted = false;
      // Leave room on unmount
      watchPartyService.leaveWatchRoom(roomId).catch(console.error);
    };
  }, [roomId]);

  // Subscribe to socket events
  useEffect(() => {
    if (!roomId) return;

    const handlePlaybackStateChanged = (data: any) => {
      if (data && data.channelId === roomId) {
        setRoom(prev => prev ? { ...prev, isPlaying: data.isPlaying, currentTimestamp: data.currentTimestamp } : null);
        setRemotePlaybackState({
          isPlaying: data.isPlaying,
          currentTimestamp: data.currentTimestamp,
          updatedAt: Date.now(),
        });
      }
    };

    const handleSourceChanged = (data: any) => {
      if (data && data.channelId === roomId) {
        setRoom(prev => prev ? { 
          ...prev, 
          currentSourceUrl: data.currentSourceUrl, 
          settings: data.settings,
          isPlaying: data.isPlaying,
          currentTimestamp: data.currentTimestamp
        } : null);
        setRemotePlaybackState({
          isPlaying: data.isPlaying,
          currentTimestamp: data.currentTimestamp,
          updatedAt: Date.now(),
        });
      }
    };

    socketService.on(WATCH_ALONG_EVENTS.PLAYBACK_STATE_CHANGED, handlePlaybackStateChanged);
    socketService.on(WATCH_ALONG_EVENTS.SOURCE_CHANGED, handleSourceChanged);

    return () => {
      socketService.off(WATCH_ALONG_EVENTS.PLAYBACK_STATE_CHANGED, handlePlaybackStateChanged);
      socketService.off(WATCH_ALONG_EVENTS.SOURCE_CHANGED, handleSourceChanged);
    };
  }, [roomId]);

  // Actions
  const play = useCallback((timestamp?: number) => {
    if (!isHost || !roomId) return;
    socketService.emit(WATCH_ALONG_EVENTS.PLAYBACK_PLAY, { channelId: roomId, atTimestamp: timestamp });
  }, [isHost, roomId]);

  const pause = useCallback((timestamp?: number) => {
    if (!isHost || !roomId) return;
    socketService.emit(WATCH_ALONG_EVENTS.PLAYBACK_PAUSE, { channelId: roomId, atTimestamp: timestamp });
  }, [isHost, roomId]);

  const seek = useCallback((timestamp: number) => {
    if (!isHost || !roomId) return;
    socketService.emit(WATCH_ALONG_EVENTS.PLAYBACK_SEEK, { channelId: roomId, toTimestamp: timestamp });
  }, [isHost, roomId]);

  const changeEpisode = useCallback((newSourceUrl: string, newEpisodeNumber?: number) => {
    if (!isHost || !roomId) return;
    socketService.emit(WATCH_ALONG_EVENTS.CHANGE_EPISODE, { channelId: roomId, newSourceUrl, newEpisodeNumber });
  }, [isHost, roomId]);

  return {
    room,
    isHost,
    isLoading,
    error,
    remotePlaybackState,
    actions: {
      play,
      pause,
      seek,
      changeEpisode,
    }
  };
};
