import { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@/contexts/UserContext.jsx';
import { useNotification } from '@/contexts/NotificationContext.jsx';
import chatService, { chatApiService } from '@/services/chat.service.js';

export const useChat = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const { user } = useUser();
  const { showToastNotification } = useNotification();
  const typingTimeoutRef = useRef(null);

  const fetchRooms = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await chatApiService.getChatRooms();

      if (response.success) {
        setRooms(response.data || []);
      } else {
        setRooms([]);
      }
    } catch (error) {
      showToastNotification('Failed to load chat rooms', 'error');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id, showToastNotification]);

  const loadMessages = useCallback(async (chatRoomId) => {
    if (!chatRoomId) return;

    try {
      setLoading(true);
      const response = await chatApiService.getMessages(chatRoomId, {
        limit: 50,
        offset: 0
      });

      if (response.success) {
        setMessages(response.data || []);
      } else {
        setMessages([]);
      }
    } catch (error) {
      showToastNotification('Failed to load messages', 'error');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [showToastNotification]);

  const markMessagesAsRead = useCallback(async (chatRoomId) => {
    if (!chatRoomId) return;

    try {
      const response = await chatApiService.markMessagesAsRead(chatRoomId);

      if (response.success) {
        setRooms(prev => prev.map(room =>
          room.chatRoomId === chatRoomId
            ? { ...room, unreadCount: 0 }
            : room
        ));
        await fetchUnreadCount();
      }
    } catch (error) {
      // Silent fail
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await chatApiService.getUnreadCount();
      if (response.success) {
        const count = response.data?.unreadCount || 0;
        setUnreadCount(count);
      }
    } catch (error) {
      // Silent fail
    }
  }, [user?.id]);

  const selectRoom = useCallback(async (room) => {
    try {
      setCurrentRoom(room);
      setMessages([]);
      await loadMessages(room.chatRoomId);

      if (connected && chatService.isConnected) {
        chatService.joinRoomById(room.chatRoomId);
      }

      setTimeout(() => {
        markMessagesAsRead(room.chatRoomId);
      }, 500);

    } catch (error) {
      showToastNotification('Failed to select chat room', 'error');
    }
  }, [connected, loadMessages, showToastNotification, markMessagesAsRead]);

  const sendMessage = useCallback(async (content, type = 'TEXT') => {
    if (!currentRoom?.chatRoomId || !content.trim()) return;

    try {
      // ✅ Use WebSocket instead of REST API
      if (connected && chatService.isConnected) {
        chatService.sendMessageWS(currentRoom.chatRoomId, content.trim(), type);
      } else {
        // Fallback to REST API if WebSocket not connected
        const response = await chatService.sendMessage(currentRoom.chatRoomId, {
          content: content.trim(),
          type
        });

        if (response.success) {
          const newMessage = response.data;
          if (newMessage) {
            setMessages(prev => {
              const exists = prev.some(m => m.messageId === newMessage.messageId);
              if (exists) return prev;
              return [...prev, newMessage];
            });
          }
          fetchRooms();
        } else {
          throw new Error(response.message);
        }
      }
    } catch (error) {
      showToastNotification('Failed to send message', 'error');
    }
  }, [currentRoom?.chatRoomId, connected, fetchRooms, showToastNotification]);

  const handleTyping = useCallback((roomId) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (connected && chatService.isConnected) {
      chatService.sendTyping(roomId);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setTyping(false);
    }, 2000);
  }, [connected]);

  const createChatRoom = useCallback(async (otherUserId) => {
    try {
      const response = await chatApiService.createOrGetChatRoom({ otherUserId });

      if (response.success) {
        await fetchRooms();

        const roomData = response.data.chatRoom;
        const room = {
          chatRoomId: roomData.chatRoomId,
          otherUser: response.data.otherUser,
          unreadCount: 0,
          lastMessage: null
        };

        await selectRoom(room);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      showToastNotification('Failed to create chat room', 'error');
    }
  }, [fetchRooms, selectRoom, showToastNotification]);

  useEffect(() => {
    if (!user?.id) return;

    chatService.connect();

    const handleConnected = () => {
      setConnected(true);
      fetchRooms();
      fetchUnreadCount();
    };

    const handleDisconnected = () => {
      setConnected(false);
    };

    const handleError = (error) => {
      showToastNotification(error.message || 'Chat connection error', 'error');
    };

    const handleRoomMessage = (message) => {
      if (currentRoom &&
        (message.roomId === currentRoom.chatRoomId ||
          message.chatRoomId === currentRoom.chatRoomId)) {

        if (message.senderId !== user.id) {
          setMessages(prev => {
            const exists = prev.some(m => m.messageId === message.messageId);
            if (!exists) {
              return [...prev, message];
            }
            return prev;
          });
        }
      }
      fetchRooms();
      fetchUnreadCount();
    };

    const handlePrivateMessage = (message) => {
      if (currentRoom &&
        (message.roomId === currentRoom.chatRoomId ||
          message.chatRoomId === currentRoom.chatRoomId)) {

        if (message.senderId !== user.id) {
          setMessages(prev => {
            const exists = prev.some(m => m.messageId === message.messageId);
            if (!exists) {
              return [...prev, message];
            }
            return prev;
          });
        }
      } else {
        showToastNotification(
          message.notificationText || `New message from ${message.sender?.email || 'Unknown'}`,
          'info'
        );
      }
      fetchRooms();
      fetchUnreadCount();
    };

    const handleNewMessage = (message) => {
      if (currentRoom && message.chatRoomId === currentRoom.chatRoomId) {
        setMessages(prev => {
          const exists = prev.some(m => m.messageId === message.messageId);
          if (exists) return prev;
          return [...prev, message];
        });
      }
      fetchRooms();
      fetchUnreadCount();
    };

    const handleMessageSent = (data) => {
      if (data.success && currentRoom && data.data.chatRoomId === currentRoom.chatRoomId) {
        setMessages(prev => {
          const exists = prev.some(m => m.messageId === data.data.messageId);
          if (!exists) {
            return [...prev, data.data];
          }
          return prev;
        });
      }
      fetchRooms();
    };

    const handleRoomJoined = (data) => {
      if (data.chatRoomId && currentRoom?.chatRoomId === data.chatRoomId) {
        loadMessages(data.chatRoomId);
      }
    };

    const handleUserTyping = (data) => {
      if (currentRoom && data.chatRoomId === currentRoom.chatRoomId && data.userId !== user.id) {
        setTyping(true);

        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
          setTyping(false);
        }, 3000);
      }
    };

    const handleMessagesRead = (data) => {
      if (currentRoom && data.chatRoomId === currentRoom.chatRoomId) {
        setRooms(prev => prev.map(room =>
          room.chatRoomId === data.chatRoomId
            ? { ...room, unreadCount: 0 }
            : room
        ));
      }
    };

    // ✅ Enhanced event listeners
    chatService.on('connected', handleConnected);
    chatService.on('disconnected', handleDisconnected);
    chatService.on('error', handleError);
    chatService.on('room_message', handleRoomMessage);
    chatService.on('private_message', handlePrivateMessage);
    chatService.on('new_message', handleNewMessage);
    chatService.on('message_sent', handleMessageSent);
    chatService.on('room_joined', handleRoomJoined);
    chatService.on('user_typing', handleUserTyping);
    chatService.on('messages_read', handleMessagesRead);

    return () => {
      chatService.off('connected', handleConnected);
      chatService.off('disconnected', handleDisconnected);
      chatService.off('error', handleError);
      chatService.off('room_message', handleRoomMessage);
      chatService.off('private_message', handlePrivateMessage);
      chatService.off('new_message', handleNewMessage);
      chatService.off('message_sent', handleMessageSent);
      chatService.off('room_joined', handleRoomJoined);
      chatService.off('user_typing', handleUserTyping);
      chatService.off('messages_read', handleMessagesRead);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      chatService.disconnect();
    };
  }, [user?.id, currentRoom, fetchRooms, fetchUnreadCount, showToastNotification, loadMessages]);

  return {
    rooms,
    currentRoom,
    messages,
    connected,
    loading,
    typing,
    unreadCount,
    selectRoom,
    sendMessage,
    createChatRoom,
    handleTyping,
    fetchRooms,
    loadMessages,
    markMessagesAsRead,
    fetchUnreadCount,
    joinRoom: selectRoom,
  };
};
