import React, { createContext, useContext, useCallback } from 'react';
import { Toast } from '@/components/ui/index.js';
import toast from "react-hot-toast";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const showToastNotification = useCallback((message, type = "info") => {
    toast(<Toast message={message} type={type} />, {
      duration: 3000,
      position: "top-right",
    });
  }, []);

  return (
    <NotificationContext.Provider value={{ showToastNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
