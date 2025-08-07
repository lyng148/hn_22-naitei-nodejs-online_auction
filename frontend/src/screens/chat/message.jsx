import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@/contexts/UserContext.jsx';

const Message = ({ message }) => {
  const { user } = useUser();
  const isMyMessage = message.senderId === user?.id;

  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
        isMyMessage
          ? 'bg-blue-500 text-white'
          : 'bg-gray-200 text-gray-800'
      }`}>
        {/* Sender name (for other person's messages) */}
        {!isMyMessage && (
          <div className="text-xs text-gray-600 mb-1">
            {message.sender?.profile?.fullName || message.sender?.email || 'Unknown'}
          </div>
        )}

        {/* Message content */}
        <div className="text-sm">
          {message.type === 'TEXT' && message.content}
          {message.type === 'IMAGE' && (
            <div>
              <img
                src={message.fileUrl}
                alt="Image"
                className="max-w-full h-auto rounded"
              />
              {message.content && (
                <p className="mt-2">{message.content}</p>
              )}
            </div>
          )}
        </div>

        {/* Timestamp and status */}
        <div className={`text-xs mt-1 ${
          isMyMessage ? 'text-blue-100' : 'text-gray-500'
        }`}>
          <span>
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
          {isMyMessage && (
            <span className="ml-2">
              {message.status === 'SENDING' && '⏳'}
              {message.status === 'SENT' && '✓'}
              {message.status === 'READ' && '✓✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
