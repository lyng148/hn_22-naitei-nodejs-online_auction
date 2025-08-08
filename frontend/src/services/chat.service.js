import { io } from 'socket.io-client';
import { getAccessToken } from "@/utils/token-storage.js";

/**
 * Chat Service Class
 * Handles both REST API calls and WebSocket connections for chat functionality
 */
class ChatService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.eventCallbacks = new Map();
    this.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  }

  // ============= REST API Methods =============

  /**
   * Helper method to make authenticated HTTP requests
   */
  async makeRequest(endpoint, options = {}) {
    const token = getAccessToken();

    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      ...options,
    };

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, defaultOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Get all chat rooms for current user
   */
  async getRooms() {
    try {
      console.log('🔄 ChatService: Fetching chat rooms...');
      const data = await this.makeRequest('/api/chat/rooms');
      console.log('✅ ChatService: Rooms fetched:', data?.data?.length || 0);
      return data;
    } catch (error) {
      console.error('❌ ChatService: Failed to fetch rooms:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch chat rooms',
        data: []
      };
    }
  }

  /**
   * Create or get existing chat room with another user
   */
  async createOrGetRoom(otherUserId) {
    try {
      console.log('🔄 ChatService: Creating/getting room with user:', otherUserId);
      const data = await this.makeRequest('/api/chat/rooms', {
        method: 'POST',
        body: JSON.stringify({ otherUserId }),
      });
      console.log('✅ ChatService: Room created/retrieved successfully');
      return data;
    } catch (error) {
      console.error('❌ ChatService: Failed to create/get room:', error);
      return {
        success: false,
        message: error.message || 'Failed to create/get chat room',
        data: null
      };
    }
  }

  /**
   * Get messages for a specific chat room
   */
  async getMessages(chatRoomId, query = {}) {
    try {
      console.log('🔄 ChatService: Fetching messages for room:', chatRoomId);

      const params = new URLSearchParams();
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.offset) params.append('offset', query.offset.toString());

      const endpoint = `/api/chat/rooms/${chatRoomId}/messages${params.toString() ? `?${params}` : ''}`;
      const data = await this.makeRequest(endpoint);

      console.log('✅ ChatService: Messages fetched:', {
        success: data.success,
        count: data.data?.length || 0,
        roomId: chatRoomId
      });

      return data;
    } catch (error) {
      console.error('❌ ChatService: Failed to fetch messages:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch messages',
        data: []
      };
    }
  }

  /**
   * Send message via REST API
   */
  async sendMessage(chatRoomId, messageData) {
    try {
      console.log('🔄 ChatService: Sending message to room:', chatRoomId, messageData);

      const data = await this.makeRequest(`/api/chat/rooms/${chatRoomId}/messages`, {
        method: 'POST',
        body: JSON.stringify({
          content: messageData.content,
          type: messageData.type || 'TEXT',
          fileUrl: messageData.fileUrl || null
        }),
      });

      console.log('✅ ChatService: Message sent successfully');
      return data;
    } catch (error) {
      console.error('❌ ChatService: Failed to send message:', error);
      return {
        success: false,
        message: error.message || 'Failed to send message',
        data: null
      };
    }
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(chatRoomId) {
    try {
      console.log('🔄 ChatService: Marking messages as read for room:', chatRoomId);

      const data = await this.makeRequest(`/api/chat/rooms/${chatRoomId}/mark-read`, {
        method: 'POST',
      });

      console.log('✅ ChatService: Messages marked as read');
      return data;
    } catch (error) {
      console.error('❌ ChatService: Failed to mark messages as read:', error);
      return {
        success: false,
        message: error.message || 'Failed to mark messages as read',
        data: null
      };
    }
  }

  /**
   * Get unread messages count
   */
  async getUnreadCount() {
    try {
      console.log('🔄 ChatService: Fetching unread count...');

      const data = await this.makeRequest('/api/chat/unread-count');

      console.log('✅ ChatService: Unread count fetched:', data?.data?.unreadCount || 0);
      return data;
    } catch (error) {
      console.error('❌ ChatService: Failed to fetch unread count:', error);
      return {
        success: false,
        message: error.message || 'Failed to get unread count',
        data: { unreadCount: 0 }
      };
    }
  }

  /**
   * Get chat room details
   */
  async getChatRoomDetails(chatRoomId) {
    try {
      console.log('🔄 ChatService: Fetching room details:', chatRoomId);

      const data = await this.makeRequest(`/api/chat/rooms/${chatRoomId}`);

      console.log('✅ ChatService: Room details fetched');
      return data;
    } catch (error) {
      console.error('❌ ChatService: Failed to fetch room details:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch room details',
        data: null
      };
    }
  }

  // ============= WebSocket Methods =============

  /**
   * Connect to WebSocket server
   */
  connect() {
    const token = getAccessToken();
    if (!token) {
      console.error('❌ ChatService: No access token found');
      this.emit('error', { message: 'No authentication token' });
      return null;
    }

    console.log('🔄 ChatService: Connecting to WebSocket...');
    console.log('🔑 ChatService: Token present:', !!token);
    console.log('🌐 ChatService: Backend URL:', this.baseURL);

    // Disconnect existing connection
    if (this.socket && this.socket.connected) {
      console.log('🔄 ChatService: Disconnecting existing connection...');
      this.socket.disconnect();
    }

    this.socket = io(`${this.baseURL}/chat`, {
      auth: {
        token: token
      },
      transports: ['websocket'],
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

  /**
   * Setup WebSocket event handlers
   */
  setupEventHandlers() {
    if (!this.socket) return;

    // Remove existing listeners first
    this.socket.removeAllListeners();

    // Connection events
    this.socket.on('connect', () => {
      this.isConnected = true;
      this.emit('connected');
    });

    this.socket.on('connection_success', (data) => {
      this.emit('connection_success', data);
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.emit('disconnected', reason);
    });

    this.socket.on('connect_error', (error) => {
      this.emit('error', error);
    });

    this.socket.on('error', (error) => {
      this.emit('error', error);
    });

    // ✅ Enhanced chat events
    this.socket.on('chat_room_joined', (data) => {
      this.emit('room_joined', data);
    });

    this.socket.on('room_message', (message) => {
      this.emit('room_message', message);
    });

    this.socket.on('private_message', (message) => {
      this.emit('private_message', message);
    });

    this.socket.on('new_message', (message) => {
      this.emit('new_message', message);
    });

    this.socket.on('message_sent', (data) => {
      this.emit('message_sent', data);
    });

    this.socket.on('messages_read', (data) => {
      this.emit('messages_read', data);
    });

    this.socket.on('user_joined', (data) => {
      this.emit('user_joined', data);
    });

    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });

    this.socket.on('user_stopped_typing', (data) => {
      this.emit('user_stopped_typing', data);
    });

    this.socket.on('message_notification', (data) => {
      this.emit('message_notification', data);
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.socket && this.socket.connected) {
      console.log('🔌 ChatService: Disconnecting WebSocket...');
      this.socket.disconnect();
    }
    this.isConnected = false;
  }

  /**
   * Join a chat room via WebSocket
   */
  joinRoom(chatRoomIdOrUserId, isUserId = false, query = { limit: 50, offset: 0 }) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    if (isUserId) {
      // Join by otherUserId (create/get room)
      this.socket.emit('join_chat_room', {
        otherUserId: chatRoomIdOrUserId,
        query
      });
    } else {
      // Join by chatRoomId (existing room)
      this.socket.emit('join_chat_room', {
        chatRoomId: chatRoomIdOrUserId,
        query
      });
    }
  }

  joinRoomById(chatRoomId, query = { limit: 50, offset: 0 }) {
    this.joinRoom(chatRoomId, false, query);
  }

  joinRoomByUserId(otherUserId, query = { limit: 50, offset: 0 }) {
    this.joinRoom(otherUserId, true, query);
  }

  /**
   * Send message via WebSocket
   */
  sendMessageWS(chatRoomId, content, type = 'TEXT') {
    if (!this.socket || !this.isConnected) {
      return;
    }

    // ✅ Use correct event name that matches backend
    this.socket.emit('send_message', {
      chatRoomId,
      content,
      type
    });
  }

  /**
   * Mark messages as read via WebSocket
   */
  markAsReadWS(chatRoomId) {
    if (!this.socket || !this.isConnected) {
      console.warn('⚠️ ChatService: Cannot mark as read - WebSocket not connected');
      return;
    }

    console.log('👁️ ChatService: Marking as read via WebSocket:', chatRoomId);
    this.socket.emit('mark_read', { chatRoomId });
  }

  /**
   * Get more messages via WebSocket
   */
  getMoreMessages(chatRoomId, query) {
    if (!this.socket || !this.isConnected) {
      console.warn('⚠️ ChatService: Cannot get more messages - WebSocket not connected');
      return;
    }

    console.log('📨 ChatService: Getting more messages via WebSocket:', { chatRoomId, query });
    this.socket.emit('get_more_messages', { chatRoomId, query });
  }

  /**
   * Send typing indicator
   */
  sendTyping(chatRoomId) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('typing_start', { chatRoomId });
  }

  /**
   * Stop typing indicator
   */
  stopTyping(chatRoomId) {
    if (!this.socket || !this.isConnected) {
      return;
    }

    this.socket.emit('typing_stop', { chatRoomId });
  }

  // ============= Event Handling =============

  /**
   * Subscribe to events
   */
  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event).push(callback);
  }

  /**
   * Unsubscribe from events
   */
  off(event, callback) {
    if (this.eventCallbacks.has(event)) {
      const callbacks = this.eventCallbacks.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Emit custom events to subscribers
   */
  emit(event, data) {
    if (this.eventCallbacks.has(event)) {
      this.eventCallbacks.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ ChatService: Error in event callback for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Get connection status
   */
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      socketId: this.socket?.id || null,
      socketConnected: this.socket?.connected || false,
    };
  }

  /**
   * Debug helper
   */
  debug() {
    return {
      isConnected: this.isConnected,
      socket: this.socket ? {
        id: this.socket.id,
        connected: this.socket.connected,
        url: this.socket.io.uri,
      } : null,
      eventCallbacks: Array.from(this.eventCallbacks.keys()),
      baseURL: this.baseURL,
    };
  }
}

// Export singleton instance
export const chatService = new ChatService();
export default chatService;

// Also export individual methods for direct use in chatApiService.js
export const chatApiService = {
  getChatRooms: () => chatService.getRooms(),
  getMessages: (chatRoomId, query) => chatService.getMessages(chatRoomId, query),
  sendMessage: (chatRoomId, messageData) => chatService.sendMessage(chatRoomId, messageData),
  createOrGetChatRoom: (data) => chatService.createOrGetRoom(data.otherUserId),
  markMessagesAsRead: (chatRoomId) => chatService.markMessagesAsRead(chatRoomId),
  getUnreadCount: () => chatService.getUnreadCount(),
  getChatRoomDetails: (chatRoomId) => chatService.getChatRoomDetails(chatRoomId),
};
