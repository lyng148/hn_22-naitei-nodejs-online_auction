import React, { createContext, useContext, useCallback } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const showToastNotification = useCallback((message, type = 'info') => {
    toast(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      type,
      style: {
        borderRadius: '8px',
        background: '#fff',
        color: '#333',
      },
      className: `border-l-4 ${
        type === 'success' ? 'border-green-500' :
          type === 'error' ? 'border-red-500' :
            type === 'warning' ? 'border-yellow-500' :
              'border-blue-500'
      }`,
    });
  }, []);

  const value = {
    showToastNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
