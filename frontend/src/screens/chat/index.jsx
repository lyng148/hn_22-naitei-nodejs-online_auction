import React from 'react';
import ChatWindow from '@/screens/chat/chatWindow.jsx';
import { Layout } from '../../components/layout';

const ChatPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Layout>
      <ChatWindow />
      </Layout>
    </div>
  );
};

export default ChatPage;
