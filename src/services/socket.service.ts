// shared-logic/src/services/socket.service.ts
import { io, Socket } from 'socket.io-client';
import { SharedConfig } from '../api/config';
import { getStorageItem } from '../api/apiClient';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();
  private isConnecting = false;

  get isConnected(): boolean {
    return !!this.socket?.connected;
  }

  async connect() {
    if (this.isConnecting) return;
    
    if (this.socket) {
      if (this.socket.connected) return;
      this.isConnecting = true;
      try {
        this.socket.connect();
      } finally {
        this.isConnecting = false;
      }
      return;
    }

    this.isConnecting = true;

    try {
      const token = await getStorageItem('accessToken');
      if (!token) {
        console.warn('Socket connect failed: No access token');
        return;
      }

      // Backend Socket.IO URL
      // Nếu là môi trường Dev (dùng /api proxy), thì websocket cũng nên dùng proxy ('/')
      const isDev = SharedConfig.apiBaseUrl === '/api';
      const baseUrl = isDev ? '/' : (SharedConfig.VITE_BACKEND_DOMAIN || SharedConfig.apiBaseUrl.replace(/\/api\/?$/, ''));

      this.socket = io(baseUrl, {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      this.socket.on('connect', () => {
        // Connect logic
      });

      this.socket.on('disconnect', () => {
        // Disconnect logic
      });

      this.socket.on('message', (envelope: any) => {
        const { event, data } = envelope;
        if (event) {
          this.emitLocal(event, data);
        }
      });
    } finally {
      this.isConnecting = false;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  emit(event: string, data: any) {
    if (!this.socket?.connected) {
      return;
    }

    const generateUUID = () => {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    };

    // BE uses strict EventEnvelope format
    const envelope = {
      event,
      version: '1.0',
      requestId: generateUUID(),
      timestamp: Date.now(),
      data,
    };

    this.socket.emit('message', envelope);
  }

  // Local event emitter for components to subscribe
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
    return () => this.off(event, callback); // Returns unsubscribe function
  }

  off(event: string, callback: Function) {
    const list = this.listeners.get(event);
    if (list) {
      this.listeners.set(event, list.filter(cb => cb !== callback));
    }
  }

  private emitLocal(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}

export const socketService = new SocketService();
