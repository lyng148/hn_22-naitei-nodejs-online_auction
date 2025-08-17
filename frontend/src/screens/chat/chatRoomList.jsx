import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

const ChatRoomList = ({ rooms, onRoomSelect, onDeleteRoom, currentRoom }) => {
  const [showDeleteMenu, setShowDeleteMenu] = useState(null);

  const handleRoomClick = (room) => {
    setShowDeleteMenu(null);
    onRoomSelect(room);
  };

  const handleDeleteClick = (e, room) => {
    e.stopPropagation();
    onDeleteRoom(room);
    setShowDeleteMenu(null);
  };

  const toggleDeleteMenu = (e, roomId) => {
    e.stopPropagation();
    setShowDeleteMenu(showDeleteMenu === roomId ? null : roomId);
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowDeleteMenu(null);
    };

    if (showDeleteMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showDeleteMenu]);

  if (!rooms || rooms.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="py-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="font-semibold text-gray-700 text-lg">No conversations yet</p>
          <p className="text-sm mt-1 text-gray-500">Start messaging with friends!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {rooms.map((room) => {
        const hasRecentUnread = room.unreadCount > 0 && room.lastMessage &&
          new Date(room.lastMessage.timestamp) > new Date(Date.now() - 5 * 60 * 1000);

        return (
          <div
            key={room.chatRoomId}
            className={`relative px-4 py-3 cursor-pointer hover:bg-gray-50 transition-all duration-200 group ${currentRoom?.chatRoomId === room.chatRoomId
                ? 'bg-blue-50 border-r-4 border-blue-500'
                : ''
              }`}
            onClick={() => handleRoomClick(room)}
          >
            <div className="flex items-center space-x-3">
              {/* Avatar with online indicator */}
              <div className="relative">
                <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0">
                  {room.otherUser?.profile?.profileImageUrl ? (
                    <img
                      src={room.otherUser.profile.profileImageUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div
                    className={`w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center ${room.otherUser?.profile?.profileImageUrl ? 'hidden' : 'flex'
                      }`}
                  >
                    <span className="font-semibold text-lg text-white">
                      {room.otherUser?.profile?.fullName?.charAt(0) ||
                        room.otherUser?.email?.charAt(0) || '?'}
                    </span>
                  </div>
                </div>

                {/* Online status indicator */}
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-semibold truncate ${hasRecentUnread ? 'text-gray-900' : 'text-gray-800'
                    }`}>
                    {room.otherUser?.profile?.fullName || room.otherUser?.email || 'Unknown User'}
                  </h3>

                  <div className="flex items-center space-x-2">
                    {room.lastMessage && (
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatDistanceToNow(new Date(room.lastMessage.timestamp), { addSuffix: false })}
                      </span>
                    )}

                    {onDeleteRoom && (
                      <div className="relative">
                        <button
                          onClick={(e) => toggleDeleteMenu(e, room.chatRoomId)}
                          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-all duration-200"
                          title="More options"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {showDeleteMenu === room.chatRoomId && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                            <button
                              onClick={(e) => handleDeleteClick(e, room)}
                              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 flex items-center"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Chat
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className={`text-sm truncate pr-2 ${hasRecentUnread ? 'text-gray-900 font-medium' : 'text-gray-600'
                    }`}>
                    {room.lastMessage ? (
                      <>
                        {room.lastMessage.type === 'IMAGE' && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Sent a photo
                          </span>
                        )}
                        {room.lastMessage.type === 'FILE' && (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                            Sent an attachment
                          </span>
                        )}
                        {room.lastMessage.type === 'TEXT' && room.lastMessage.content}
                      </>
                    ) : (
                      <span className="italic text-gray-400">Start the conversation</span>
                    )}
                  </p>

                  {room.unreadCount > 0 && (
                    <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${hasRecentUnread ? 'bg-blue-500' : 'bg-gray-400'
                      }`}>
                      <span className="text-white text-xs font-bold">
                        {room.unreadCount > 9 ? '9+' : room.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatRoomList;
