import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useUser } from '@/contexts/UserContext.jsx';

const Message = ({ message }) => {
  const { user } = useUser();
  const isMyMessage = message.senderId === user?.id;
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return '📎';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType.includes('excel') || fileType.includes('sheet')) return '📊';
    if (fileType.includes('text')) return '📋';
    return '📎';
  };

  const getFileName = (content, fileUrl) => {
    // Extract filename from content (e.g., "📷 Sent an image: sunset.jpg")
    const match = content?.match(/: (.+)$/);
    if (match) return match[1];

    // Extract from URL as fallback
    if (fileUrl) {
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      // Remove UUID prefix (user123-uuid-filename.ext)
      const cleanName = fileName.split('-').slice(2).join('-');
      return cleanName || fileName;
    }

    return 'Unknown file';
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleFileDownload = (fileUrl, fileName) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderMessageContent = () => {
    if (message.type === 'TEXT') {
      return <div className="text-sm leading-relaxed break-words">{message.content}</div>;
    }

    if (message.type === 'IMAGE') {
      const fileName = getFileName(message.content, message.fileUrl);

      return (
        <div className="max-w-xs">
          {/* Image */}
          <div className="relative rounded-lg overflow-hidden">
            {imageLoading && !imageError && (
              <div className="flex items-center justify-center h-32 bg-gray-200 rounded-lg animate-pulse">
                <div className="text-gray-400">Loading...</div>
              </div>
            )}

            {!imageError ? (
              <img
                src={message.fileUrl}
                alt={fileName}
                className={`max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${imageLoading ? 'hidden' : 'block'
                  }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onClick={() => window.open(message.fileUrl, '_blank')}
                style={{ maxHeight: '300px' }}
              />
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-1">🖼️</div>
                  <div className="text-sm">Image unavailable</div>
                  <button
                    onClick={() => handleFileDownload(message.fileUrl, fileName)}
                    className="text-blue-500 text-xs underline mt-1"
                  >
                    Download
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Caption */}
          {message.content && !message.content.startsWith('📷 Sent an image:') && (
            <div className="mt-2 px-3 pb-1">
              <div className="text-sm leading-relaxed">{message.content}</div>
            </div>
          )}
        </div>
      );
    }

    if (message.type === 'FILE') {
      const fileName = getFileName(message.content, message.fileUrl);
      const fileExtension = fileName.split('.').pop()?.toLowerCase() || '';

      return (
        <div className="max-w-sm">
          {/* File card */}
          <div
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isMyMessage
                ? 'bg-blue-600 border-blue-500 hover:bg-blue-700 shadow-sm'
                : 'bg-white border-gray-200 hover:bg-gray-50 shadow-sm'
              }`}
            onClick={() => handleFileDownload(message.fileUrl, fileName)}
          >
            <div className="text-2xl">
              {getFileIcon(fileExtension)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate text-sm ${isMyMessage ? 'text-white' : 'text-gray-800'
                }`}>
                {fileName}
              </p>
              <p className={`text-xs ${isMyMessage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                {fileExtension.toUpperCase()} file • Click to download
              </p>
            </div>
            <div className={`text-xs ${isMyMessage ? 'text-blue-100' : 'text-gray-400'
              }`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>

          {/* Caption */}
          {message.content && !message.content.startsWith('📎 Sent a file:') && (
            <div className="mt-2 text-sm leading-relaxed">{message.content}</div>
          )}
        </div>
      );
    }

    return <div className="text-sm leading-relaxed break-words">{message.content}</div>;
  };

  return (
    <div className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-1 group`}>
      {/* Other user's avatar */}
      {!isMyMessage && (
        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mr-2 mt-auto">
          {message.sender?.profile?.profileImageUrl ? (
            <img
              src={message.sender.profile.profileImageUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {message.sender?.profile?.fullName?.charAt(0) ||
                  message.sender?.email?.charAt(0) || '?'}
              </span>
            </div>
          )}
        </div>
      )}

      <div className={`max-w-xs lg:max-w-md ${isMyMessage ? 'ml-12' : 'mr-12'}`}>
        {/* Sender name (for other person's messages) */}
        {!isMyMessage && (
          <div className="text-xs text-gray-500 mb-1 ml-3">
            {message.sender?.profile?.fullName || message.sender?.email || 'Unknown'}
          </div>
        )}

        {/* Message bubble */}
        <div className={`relative px-4 py-2 ${isMyMessage
            ? 'bg-blue-500 text-white rounded-2xl rounded-br-md'
            : 'bg-gray-200 text-gray-800 rounded-2xl rounded-bl-md'
          } ${message.type === 'IMAGE' ? 'p-1' : ''}`}>
          {/* Message content */}
          {renderMessageContent()}
        </div>

        {/* Timestamp and status - shown on hover */}
        <div className={`text-xs mt-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isMyMessage ? 'text-right text-gray-500' : 'text-left text-gray-500'
          }`}>
          <span>
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
          {isMyMessage && (
            <span className="ml-2">
              {message.status === 'SENDING' && (
                <svg className="w-3 h-3 inline animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {message.status === 'SENT' && (
                <svg className="w-3 h-3 inline text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              {message.status === 'READ' && (
                <svg className="w-3 h-3 inline text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
