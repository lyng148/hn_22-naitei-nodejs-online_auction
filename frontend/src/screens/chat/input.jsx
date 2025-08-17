import React, { useState, useRef, useCallback } from 'react';
import { useNotification } from '@/contexts/NotificationContext.jsx';
import FileUpload from './fileUpload.jsx';

const Input = ({
  onSendMessage,
  onUploadFileAndSendMessage,
  disabled = false,
  placeholder = "Type a message...",
  currentRoom,
  uploading = false
}) => {
  const [message, setMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const textareaRef = useRef(null);
  const { showToastNotification } = useNotification();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!message.trim()) return;
    if (disabled || uploading) return;

    try {
      await onSendMessage(message.trim(), 'TEXT');
      setMessage('');

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      if (showToastNotification) {
        showToastNotification('Failed to send message', 'error');
      }
    }
  }, [message, disabled, uploading, onSendMessage, showToastNotification]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  const handleTextareaChange = useCallback((e) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);

  const handleFileSelect = useCallback(async (file) => {
    if (!currentRoom?.chatRoomId) {
      if (showToastNotification) {
        showToastNotification('Please select a chat room first', 'error');
      }
      return;
    }

    if (!onUploadFileAndSendMessage) {
      if (showToastNotification) {
        showToastNotification('File upload not available', 'error');
      }
      return;
    }

    try {
      // Use the message as caption for the file
      const content = message.trim();

      await onUploadFileAndSendMessage(file, content);

      // Clear input and hide file upload
      setMessage('');
      setShowFileUpload(false);

      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }

      if (showToastNotification) {
        showToastNotification('File sent successfully!', 'success');
      }
    } catch (error) {
      console.error('Failed to send file:', error);
      if (showToastNotification) {
        showToastNotification(error.message || 'Failed to send file', 'error');
      }
    }
  }, [currentRoom?.chatRoomId, message, onUploadFileAndSendMessage, showToastNotification]);

  const handleCancelFileUpload = useCallback(() => {
    setShowFileUpload(false);
  }, []);

  const toggleFileUpload = useCallback(() => {
    if (disabled || uploading) return;
    setShowFileUpload(prev => !prev);
  }, [disabled, uploading]);

  // File upload mode
  if (showFileUpload) {
    return (
      <div className="border-t border-gray-200 bg-white">
        {/* Header with close button */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            Attach File
          </h3>
          <button
            onClick={handleCancelFileUpload}
            disabled={uploading}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Cancel file upload"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message input for caption */}
        <div className="px-6 pt-3 pb-2">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            placeholder="Add a caption for your file (optional)..."
            className="w-full px-4 py-2 bg-gray-100 border-0 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed text-sm transition-all duration-200"
            rows={1}
            disabled={uploading}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>

        {/* File upload component */}
        <div className="px-6 pb-4">
          <FileUpload
            onFileSelect={handleFileSelect}
            onCancel={handleCancelFileUpload}
            uploading={uploading}
          />
        </div>
      </div>
    );
  }

  // Normal message input mode
  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center space-x-3">
        {/* File attach button */}
        <button
          type="button"
          onClick={toggleFileUpload}
          disabled={disabled || uploading}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Attach file"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </button>

        {/* Message input container */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextareaChange}
            onKeyPress={handleKeyPress}
            placeholder={uploading ? "Uploading file..." : placeholder}
            disabled={disabled || uploading}
            className="w-full px-4 py-2 bg-gray-100 border-0 rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white disabled:bg-gray-200 disabled:cursor-not-allowed text-sm transition-all duration-200"
            rows={1}
            style={{ minHeight: '40px', maxHeight: '120px' }}
          />
        </div>

        {/* Like/Send button */}
        {message.trim() ? (
          <button
            type="submit"
            disabled={!message.trim() || disabled || uploading}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            {uploading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        ) : (
          <button
            type="button"
            disabled={disabled || uploading}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Like"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Upload progress indicator */}
      {uploading && (
        <div className="mt-3 px-4">
          <div className="flex items-center space-x-2 text-sm text-blue-600">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Uploading file...</span>
          </div>
        </div>
      )}
    </form>
  );
};

export default Input;
