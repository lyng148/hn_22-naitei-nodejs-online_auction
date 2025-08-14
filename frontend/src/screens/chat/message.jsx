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
      return <div className="text-sm">{message.content}</div>;
    }

    if (message.type === 'IMAGE') {
      const fileName = getFileName(message.content, message.fileUrl);

      return (
        <div className="max-w-sm">
          {/* Image */}
          <div className="relative">
            {imageLoading && !imageError && (
              <div className="flex items-center justify-center h-32 bg-gray-200 rounded-lg animate-pulse">
                <div className="text-gray-400">Đang tải...</div>
              </div>
            )}

            {!imageError ? (
              <img
                src={message.fileUrl}
                alt={fileName}
                className={`max-w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity ${
                  imageLoading ? 'hidden' : 'block'
                }`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                onClick={() => window.open(message.fileUrl, '_blank')}
              />
            ) : (
              <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center text-gray-500">
                  <div className="text-2xl mb-1">🖼️</div>
                  <div className="text-sm">Không thể tải ảnh</div>
                  <button
                    onClick={() => handleFileDownload(message.fileUrl, fileName)}
                    className="text-blue-500 text-xs underline mt-1"
                  >
                    Tải xuống
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Caption */}
          {message.content && !message.content.startsWith('📷 Sent an image:') && (
            <div className="mt-2 text-sm">{message.content}</div>
          )}

          {/* File info */}
          <div className="mt-1 text-xs opacity-75">
            <span>{fileName}</span>
          </div>
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
            className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
              isMyMessage
                ? 'bg-blue-600 border-blue-500 hover:bg-blue-700'
                : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => handleFileDownload(message.fileUrl, fileName)}
          >
            <div className="text-2xl">
              {getFileIcon(fileExtension)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium truncate text-sm ${
                isMyMessage ? 'text-white' : 'text-gray-800'
              }`}>
                {fileName}
              </p>
              <p className={`text-xs ${
                isMyMessage ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {fileExtension.toUpperCase()} file • Nhấn để tải
              </p>
            </div>
            <div className={`text-xs ${
              isMyMessage ? 'text-blue-100' : 'text-gray-400'
            }`}>
              ⬇️
            </div>
          </div>

          {/* Caption */}
          {message.content && !message.content.startsWith('📎 Sent a file:') && (
            <div className="mt-2 text-sm">{message.content}</div>
          )}
        </div>
      );
    }

    return <div className="text-sm">{message.content}</div>;
  };

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
        {renderMessageContent()}

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
