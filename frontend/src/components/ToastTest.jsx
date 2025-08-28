import React from 'react';
import { useNotification } from '@/contexts/NotificationContext';

const ToastTest = () => {
  const { showToastNotification } = useNotification();

  const testToasts = () => {
    setTimeout(() => showToastNotification('This is a success message!', 'success'), 100);
    setTimeout(() => showToastNotification('This is an error message!', 'error'), 800);
    setTimeout(() => showToastNotification('This is a warning message!', 'warning'), 1500);
    setTimeout(() => showToastNotification('This is an info message!', 'info'), 2200);
  };

  return (
    <div className="p-4">
      <button 
        onClick={testToasts}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Test Toast Notifications
      </button>
    </div>
  );
};

export default ToastTest;
