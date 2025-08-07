import React, { useState } from 'react';

const Input = ({ onSendMessage, onTyping, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (onTyping) {
      onTyping();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type a message..."
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={!message.trim() || disabled}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default Input;
