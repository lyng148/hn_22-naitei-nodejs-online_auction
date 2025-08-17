const { io } = require('socket.io-client');

const API_BASE = process.env.API_BASE || 'http://localhost:3000';
const TOKEN = process.env.TOKEN || 'PASTE_YOUR_ACCESS_TOKEN';

const socket = io(`${API_BASE}/notification`, {
  transports: ['websocket'],
  auth: { token: TOKEN },
});

socket.on('connect_error', (err) => {
  console.log('connect_error:', err.message);
});

socket.on('notification_connected', (data) => {
  console.log('CONNECTED:', data);
});

socket.on('new_notification', (data) => {
  console.log('NEW_NOTIFICATION:', data);
  // Ví dụ test mark_as_read qua WS:
  // socket.emit('mark_as_read', { notificationId: data.id });
});

socket.on('notification_error', (e) => {
  console.log('NOTIFICATION_ERROR:', e);
});

socket.on('notification_disconnected', (data) => {
  console.log('DISCONNECTED:', data);
});
