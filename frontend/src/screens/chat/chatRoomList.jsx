// screens/chat/chatRoomList.jsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const ChatRoomList = ({ rooms, onRoomSelect, currentRoom }) => {
  const handleRoomClick = (room) => {
    console.log('🖱️ Room clicked:', {
      chatRoomId: room.chatRoomId,
      otherUser: room.otherUser?.email,
      unreadCount: room.unreadCount
    });

    onRoomSelect(room); // This should call selectRoom from useChat
  };

  if (!rooms || rooms.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <div className="py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
          </svg>
          <p className="font-medium">No chat rooms yet</p>
          <p className="text-sm mt-1">Start a conversation with someone!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {rooms.map((room) => (
        <div
          key={room.chatRoomId}
          className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
            currentRoom?.chatRoomId === room.chatRoomId
              ? 'bg-blue-50 border-r-4 border-blue-500'
              : ''
          }`}
          onClick={() => handleRoomClick(room)}
        >
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              {room.otherUser?.profile?.profileImageUrl ? (
                <img
                  src={room.otherUser.profile.profileImageUrl}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <span
                className={`text-green-600 font-medium text-lg ${
                  room.otherUser?.profile?.profileImageUrl ? 'hidden' : 'flex'
                } items-center justify-center`}
              >
                {room.otherUser?.profile?.fullName?.charAt(0) ||
                 room.otherUser?.email?.charAt(0) || '?'}
              </span>
            </div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {room.otherUser?.profile?.fullName || room.otherUser?.email || 'Unknown User'}
                </h3>
                {room.lastMessage && (
                  <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                    {formatDistanceToNow(new Date(room.lastMessage.timestamp), { addSuffix: true })}
                  </span>
                )}
              </div>

              {/* Last Message Preview */}
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-600 truncate">
                  {room.lastMessage ? (
                    <>
                      {room.lastMessage.type === 'IMAGE' && '📷 Image'}
                      {room.lastMessage.type === 'FILE' && '📎 File'}
                      {room.lastMessage.type === 'TEXT' && room.lastMessage.content}
                    </>
                  ) : (
                    <span className="italic">No messages yet</span>
                  )}
                </p>

                {/* Unread Badge */}
                {room.unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full flex-shrink-0 ml-2">
                    {room.unreadCount > 99 ? '99+' : room.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
