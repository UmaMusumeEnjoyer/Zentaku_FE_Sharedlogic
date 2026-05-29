export interface WatchRoom {
  channelId: string;
  hostId: string;
  mediaId?: string | null;
  isPlaying: boolean;
  currentTimestamp: number;
  currentSourceUrl?: string | null;
  playlistQueue?: any[];
  messages?: any[];
  settings?: Record<string, any>;
  participants?: WatchParticipant[];
  lastSyncedAt: string;
}

export interface WatchParticipant {
  userId: string;
  displayName: string;
  avatar?: string | null;
  role: 'host' | 'member';
}

export interface PlaybackAction {
  action: 'play' | 'pause' | 'seek';
  timestamp?: number;
}
