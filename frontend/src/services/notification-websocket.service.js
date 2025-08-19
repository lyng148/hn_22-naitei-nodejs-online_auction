import { io } from "socket.io-client";
import { getAccessToken } from "@/utils/token-storage.js";

const EVENTS = {
  CONNECTED: "notification_connected",
  DISCONNECTED: "notification_disconnected",
  ERROR: "notification_error",
  NEW: "new_notification",
  MARK_AS_READ: "mark_as_read",
  MARK_ALL_AS_READ: "mark_all_as_read",
};

class NotificationWebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventCallbacks = new Map();
    this.baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  }

  connect() {
    const token = getAccessToken();
    if (!token) {
      this.emit("error", { message: "No authentication token" });
      return null;
    }

    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }

    this.socket = io(`${this.baseURL}/notification`, {
      auth: { token },
      extraHeaders: { Authorization: `Bearer ${token}` },
      transports: ["websocket"],
      forceNew: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      autoConnect: true,
    });

    this.setupEventHandlers();
    return this.socket;
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.removeAllListeners();

    this.socket.on("connect", () => {
      this.isConnected = true;
      this.emit("connected");
    });

    this.socket.on(EVENTS.CONNECTED, (data) => {
      this.emit(EVENTS.CONNECTED, data);
    });

    this.socket.on("disconnect", (reason) => {
      this.isConnected = false;
      this.emit("disconnected", reason);
    });

    this.socket.on("connect_error", (error) => {
      this.emit("connect_error", error?.message || error);
    });

    this.socket.on("error", (error) => {
      this.emit("error", error);
    });

    this.socket.on(EVENTS.NEW, (data) => {
      this.emit(EVENTS.NEW, data);
    });

    this.socket.on(EVENTS.MARK_AS_READ, (data) => {
      this.emit(EVENTS.MARK_AS_READ, data);
    });

    this.socket.on(EVENTS.MARK_ALL_AS_READ, (data) => {
      this.emit(EVENTS.MARK_ALL_AS_READ, data);
    });

    this.socket.on(EVENTS.ERROR, (e) => {
      this.emit(EVENTS.ERROR, e);
    });

    this.socket.on(EVENTS.DISCONNECTED, (data) => {
      this.emit(EVENTS.DISCONNECTED, data);
    });
  }

  disconnect() {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
    this.isConnected = false;
  }

  markAsReadWS(notificationId) {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit(EVENTS.MARK_AS_READ, { notificationId });
  }

  markAllAsReadWS() {
    if (!this.socket || !this.isConnected) return;
    this.socket.emit(EVENTS.MARK_ALL_AS_READ);
  }

  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event).push(callback);
  }

  off(event, callback) {
    if (this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  }

  emit(event, data) {
    if (this.eventCallbacks.has(event)) {
      this.eventCallbacks.get(event).forEach((cb) => {
        try { cb(data); } catch (err) { console.error(`Error in callback for event "${event}":`, err); }
      });
    }
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null,
      socketConnected: this.socket?.connected || false,
    };
  }
}

export const notificationWebSocketService = new NotificationWebSocketService();
export default notificationWebSocketService;
