import { useState, useEffect, useCallback } from 'react';
import { watchPartyService } from '../../../services/watchParty.service';
import { socketService } from '../../../services/socket.service';
import { WATCH_ALONG_EVENTS } from '../constants/watchAlongConstants';
import type { WatchRoom } from '../types/watchAlong.types';

export const useWatchAlongLogic = (
  roomId: string,
  currentUserId: string | null,
  onKicked?: () => void,
  onRoomClosed?: () => void
) => {
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
    let hasJoined = false;

    const initRoom = async () => {
      try {
        setIsLoading(true);
        // 1. Join room (which also gets the current snapshot)
        const roomData = await watchPartyService.joinWatchRoom(roomId);
        if (mounted) {
          hasJoined = true;
          setRoom(roomData);
          setRemotePlaybackState({
            isPlaying: roomData.isPlaying,
            currentTimestamp: roomData.currentTimestamp,
            updatedAt: Date.now(),
          });
        }

        // 2. Connect socket and join the Socket.IO room for broadcasts
        await socketService.connect();

        const joinRoom = () => {
          socketService.emit('room.join', { channelId: roomId });
        };

        if (socketService.isConnected) {
          joinRoom();
        } else {
          socketService.on('connection.ready', joinRoom);
        }
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
      // Only leave if we successfully joined, prevents Strict Mode
      // double-mount from deleting the room before the second mount
      if (hasJoined) {
        if (socketService.isConnected) {
          socketService.emit(WATCH_ALONG_EVENTS.ROOM_LEAVE, { channelId: roomId });
        }
        // Leave room on unmount (REST API fallback)
        watchPartyService.leaveWatchRoom(roomId).catch(console.error);
      }
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
          messages: data.messages || prev.messages || [],
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

    const handleMessageCreated = (data: any) => {
      if (data && data.channelId === roomId) {
        setRoom(prev => prev ? {
          ...prev,
          messages: [...(prev.messages || []), data]
        } : null);
      }
    };

    const handleRoomSnapshot = (data: any) => {
      if (data && data.channelId === roomId) {
        setRoom(prev => prev ? {
          ...prev,
          participants: data.participants || []
        } : null);
      }
    };

    const handlePresenceJoined = (data: any) => {
      if (data && data.channelId === roomId) {
        setRoom(prev => {
          if (!prev) return null;
          const currentParticipants = prev.participants || [];
          // Avoid duplicates
          if (currentParticipants.some(p => p.userId === data.userId)) {
            return prev;
          }
          return {
            ...prev,
            participants: [...currentParticipants, { userId: data.userId, displayName: data.displayName, avatar: data.avatar, role: 'member' }]
          };
        });
      }
    };

    const handlePresenceLeft = (data: any) => {
      if (data && data.channelId === roomId) {
        setRoom(prev => {
          if (!prev) return null;
          const currentParticipants = prev.participants || [];
          return {
            ...prev,
            participants: currentParticipants.filter(p => p.userId !== data.userId)
          };
        });
      }
    };

    const handlePresenceKicked = (data: any) => {
      if (data && data.channelId === roomId) {
        if (onKicked) {
          onKicked();
        }
      }
    };

    const handleRoomClosed = (data: any) => {
      if (data && data.channelId === roomId) {
        if (onRoomClosed) {
          onRoomClosed();
        } else if (onKicked) {
          onKicked(); // Fallback if onRoomClosed is not provided
        }
      }
    };

    socketService.on(WATCH_ALONG_EVENTS.PLAYBACK_STATE_CHANGED, handlePlaybackStateChanged);
    socketService.on(WATCH_ALONG_EVENTS.SOURCE_CHANGED, handleSourceChanged);
    socketService.on('message.created', handleMessageCreated);
    socketService.on(WATCH_ALONG_EVENTS.ROOM_SNAPSHOT, handleRoomSnapshot);
    socketService.on(WATCH_ALONG_EVENTS.PRESENCE_JOINED, handlePresenceJoined);
    socketService.on(WATCH_ALONG_EVENTS.PRESENCE_LEFT, handlePresenceLeft);
    socketService.on(WATCH_ALONG_EVENTS.PRESENCE_KICKED, handlePresenceKicked);
    socketService.on(WATCH_ALONG_EVENTS.ROOM_CLOSED, handleRoomClosed);

    return () => {
      socketService.off(WATCH_ALONG_EVENTS.PLAYBACK_STATE_CHANGED, handlePlaybackStateChanged);
      socketService.off(WATCH_ALONG_EVENTS.SOURCE_CHANGED, handleSourceChanged);
      socketService.off('message.created', handleMessageCreated);
      socketService.off(WATCH_ALONG_EVENTS.ROOM_SNAPSHOT, handleRoomSnapshot);
      socketService.off(WATCH_ALONG_EVENTS.PRESENCE_JOINED, handlePresenceJoined);
      socketService.off(WATCH_ALONG_EVENTS.PRESENCE_LEFT, handlePresenceLeft);
      socketService.off(WATCH_ALONG_EVENTS.PRESENCE_KICKED, handlePresenceKicked);
      socketService.off(WATCH_ALONG_EVENTS.ROOM_CLOSED, handleRoomClosed);
    };
  }, [roomId, currentUserId, onKicked, onRoomClosed]);

  // Actions
  const play = useCallback((timestamp?: number) => {
    if (!isHost || !roomId) return;
    socketService.emit(WATCH_ALONG_EVENTS.PLAYBACK_PLAY, { channelId: roomId, timestamp });
  }, [isHost, roomId]);

  const pause = useCallback((timestamp?: number) => {
    if (!isHost || !roomId) return;
    socketService.emit(WATCH_ALONG_EVENTS.PLAYBACK_PAUSE, { channelId: roomId, timestamp });
  }, [isHost, roomId]);

  const seek = useCallback((timestamp: number) => {
    if (!isHost || !roomId) return;
    socketService.emit(WATCH_ALONG_EVENTS.PLAYBACK_SEEK, { channelId: roomId, timestamp });
  }, [isHost, roomId]);

  const leaveRoom = useCallback(() => {
    if (socketService.isConnected) {
      socketService.emit(WATCH_ALONG_EVENTS.ROOM_LEAVE, { channelId: roomId });
    }
    setRoom(null);
  }, [roomId]);

  const kickParticipant = useCallback((targetUserId: string) => {
    if (socketService.isConnected && isHost) {
      socketService.emit(WATCH_ALONG_EVENTS.ROOM_KICK, { channelId: roomId, targetUserId });
    }
  }, [roomId, isHost]);

  const changeEpisode = useCallback((newSourceUrl: string, newEpisodeNumber?: number, subUrl?: string | null, referer?: string | null) => {
    if (!isHost || !roomId) return;
    socketService.emit(WATCH_ALONG_EVENTS.CHANGE_EPISODE, { channelId: roomId, newSourceUrl, newEpisodeNumber, subUrl, referer });
  }, [isHost, roomId]);

  const sendMessage = useCallback((content: string) => {
    if (!roomId || !content.trim()) return;
    socketService.emit('message.send', { channelId: roomId, content, attachments: [] });
  }, [roomId]);

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
      sendMessage,
      leaveRoom,
      kickParticipant
    }
  };
};
