import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useChat } from '@/hooks/useChat.js';
import ChatRoomList from './chatRoomList.jsx';
import Message from './message.jsx';
import Input from './input.jsx';
import DeleteChatModal from './DeleteChatModal.jsx';
import UserSearchModal from './UserSearchModal.jsx';

const ChatWindow = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    rooms,
    messages,
    currentRoom,
    loading,
    connected,
    uploading,
    sendMessage,
    selectRoom,
    createChatRoom,
    deleteChatRoom,
    uploadFileAndSendMessage,
  } = useChat();

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const isScrollingRef = useRef(false);
  const lastMessageCountRef = useRef(0);

  const [deleteModal, setDeleteModal] = useState({ isOpen: false, room: null });
  const [userSearchModal, setUserSearchModal] = useState({ isOpen: false });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const scrollToBottom = useCallback((behavior = 'auto') => {
    if (isScrollingRef.current) return;

    isScrollingRef.current = true;

    if (behavior === 'auto' || behavior === 'instant') {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    } else {
      requestAnimationFrame(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({
            behavior,
            block: 'end',
            inline: 'nearest'
          });
        }
      });
    }

    setTimeout(() => {
      isScrollingRef.current = false;
    }, behavior === 'smooth' ? 100 : 10);
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    const currentMessageCount = messages.length;
    const previousMessageCount = lastMessageCountRef.current;

    if (currentMessageCount > previousMessageCount && currentMessageCount > 0) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 0);
    }

    lastMessageCountRef.current = currentMessageCount;
  }, [messages.length]);

  // Auto-scroll when room changes or loading completes
  useEffect(() => {
    if (currentRoom && messages.length > 0 && !loading) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 0);

      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 50);

      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 100);

      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 200);
    }
  }, [currentRoom?.chatRoomId, messages.length, loading]);

  // Handle initial load state
  useEffect(() => {
    if (!loading && currentRoom && messages.length > 0) {
      setTimeout(() => {
        if (messagesContainerRef.current) {
          messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
      }, 0);

      if (isInitialLoad) {
        setIsInitialLoad(false);
      }
    }
  }, [loading, currentRoom?.chatRoomId, isInitialLoad]);

  // Handle seller ID from query params
  useEffect(() => {
    const sellerId = searchParams.get('sellerId');
    if (sellerId && rooms.length > 0 && !currentRoom) {
      // Tìm room với seller này
      const existingRoom = rooms.find(room =>
        room.otherUser && room.otherUser.id === sellerId
      );

      if (existingRoom) {
        // Nếu đã có room, select room đó
        selectRoom(existingRoom);
        // Clear query param
        setSearchParams({});
      } else {
        // Nếu chưa có room, tạo mới
        createChatRoom(sellerId).then(() => {
          // Clear query param sau khi tạo xong
          setSearchParams({});
        });
      }
    }
  }, [searchParams, rooms, currentRoom, selectRoom, createChatRoom, setSearchParams]);

  const startChatwithOtherUser = async () => {
    setUserSearchModal({ isOpen: true });
  };

  const handleUserSelect = async (user) => {
    if (user && user.userId) {
      try {
        // Đóng modal trước
        setUserSearchModal({ isOpen: false });

        // Tạo hoặc lấy chat room với user được chọn
        await createChatRoom(user.userId);

        // Hiển thị thông báo thành công
        // showToastNotification(`Started chat with ${user.profile?.fullName || user.email}`, 'success');
      } catch (error) {
        // Error đã được handle trong useChat hook
        console.error('Error selecting user:', error);
      }
    }
  };

  const handleDeleteRoom = (room) => {
    setDeleteModal({ isOpen: true, room });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.room) return;

    setIsDeleting(true);
    try {
      const success = await deleteChatRoom(deleteModal.room.chatRoomId);
      if (success) {
        setDeleteModal({ isOpen: false, room: null });
      }
    } catch (error) {
      // Error handled by useChat hook
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSendMessage = useCallback(async (content, type = 'TEXT') => {
    await sendMessage(content, type);

    // Auto-scroll after sending message
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 0);

    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 50);
  }, [sendMessage]);

  const handleUploadFileAndSendMessage = useCallback(async (file, content = '') => {
    const result = await uploadFileAndSendMessage(file, content);

    // Auto-scroll after uploading file
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 100);

    return result;
  }, [uploadFileAndSendMessage]);

  return (
    <div className="w-full">
      <div className="bg-white overflow-hidden" style={{ height: 'calc(100vh - 140px)' }}>
        {/* Messenger-style layout */}
        <div className="flex h-full">{/* Sidebar - Chat rooms list */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Sidebar Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-white">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Chats</h1>
                <div className="flex items-center space-x-2">
                  {/* Connection status indicator */}
                  <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {/* New chat button */}
                  <button
                    onClick={startChatwithOtherUser}
                    disabled={uploading}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                    title="Start new chat"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search Messenger"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-full text-sm focus:outline-none focus:bg-white focus:shadow-md transition-all"
                />
                <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Chat rooms list */}
            <div className="flex-1 overflow-y-auto">
              <ChatRoomList
                rooms={rooms}
                onRoomSelect={selectRoom}
                onDeleteRoom={handleDeleteRoom}
                currentRoom={currentRoom}
              />
            </div>

            {/* Upload status */}
            {uploading && (
              <div className="px-4 py-2 border-t border-gray-200 bg-emerald-50">
                <div className="flex items-center space-x-2 text-sm text-emerald-600">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Uploading...</span>
                </div>
              </div>
            )}
          </div>

          {/* Main chat area */}
          <div className="flex-1 flex flex-col bg-white">
            {currentRoom ? (
              <>
                {/* Chat header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 relative">
                        {currentRoom.otherUser?.profile?.profileImageUrl ? (
                          <img
                            src={currentRoom.otherUser.profile.profileImageUrl}
                            alt="Avatar"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {currentRoom.otherUser?.profile?.fullName?.charAt(0) ||
                                currentRoom.otherUser?.email?.charAt(0) || '?'}
                            </span>
                          </div>
                        )}
                        {/* Online status indicator */}
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>

                      {/* User info */}
                      <div>
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {currentRoom.otherUser?.profile?.fullName ||
                            currentRoom.otherUser?.email || 'Unknown User'}
                        </h3>
                        <p className="text-sm text-green-500 font-medium">Active now</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Phone icon */}
                      <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </button>

                      {/* Video icon */}
                      <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>

                      {/* Info icon */}
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => handleDeleteRoom(currentRoom)}
                        disabled={uploading}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors disabled:opacity-50"
                        title="Delete conversation"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages area */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto px-6 py-4 bg-white"
                  style={{ scrollBehavior: 'auto' }}
                >
                  {/* Loading state - only show on initial load or when no messages */}
                  {loading && (isInitialLoad || messages.length === 0) ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-2"></div>
                        <p className="text-gray-500">Loading messages...</p>
                      </div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-medium text-2xl">
                          {currentRoom.otherUser?.profile?.fullName?.charAt(0) ||
                            currentRoom.otherUser?.email?.charAt(0) || '?'}
                        </span>
                      </div>
                      <p className="text-xl font-semibold text-gray-900 mb-2">
                        {currentRoom.otherUser?.profile?.fullName || 'User'}
                      </p>
                      <p className="text-sm text-gray-500">You're now connected on Messenger</p>
                      <p className="text-sm text-gray-400 mt-1">Say hello 👋</p>
                    </div>
                  ) : (
                    <>
                      {/* Messages list */}
                      <div className="space-y-1">
                        {messages.map((message, index) => (
                          <Message
                            key={`${message.messageId}-${index}`}
                            message={message}
                          />
                        ))}
                      </div>

                      {/* Subtle loading indicator for background loading */}
                      {loading && !isInitialLoad && messages.length > 0 && (
                        <div className="flex justify-center py-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500 opacity-50"></div>
                        </div>
                      )}

                      {/* Scroll anchor */}
                      <div
                        ref={messagesEndRef}
                        className="h-1 w-full"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </div>

                {/* Message input */}
                <Input
                  onSendMessage={handleSendMessage}
                  onUploadFileAndSendMessage={handleUploadFileAndSendMessage}
                  currentRoom={currentRoom}
                  disabled={!connected}
                  uploading={uploading}
                  placeholder={uploading ? "Uploading file..." : "Aa"}
                />
              </>
            ) : (
              /* No room selected state */
              <div className="flex-1 flex items-center justify-center bg-white">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Messages</h2>
                  <p className="text-gray-500 mb-4">Send private photos and messages to a friend or group.</p>
                  <button
                    onClick={startChatwithOtherUser}
                    className="px-6 py-3 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* User Search Modal */}
        <UserSearchModal
          isOpen={userSearchModal.isOpen}
          onClose={() => setUserSearchModal({ isOpen: false })}
          onSelectUser={handleUserSelect}
          isLoading={uploading}
        />

        {/* Delete confirmation modal */}
        <DeleteChatModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, room: null })}
          onConfirm={handleConfirmDelete}
          chatRoom={deleteModal.room}
          isLoading={isDeleting}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
