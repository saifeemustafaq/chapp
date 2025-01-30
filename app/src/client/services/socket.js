import { io } from 'socket.io-client';
import { API_URL } from '../../shared/constants';

let socket = null;

export const initializeSocket = (username, password) => {
  if (socket) {
    socket.disconnect();
  }

  socket = io(API_URL, {
    auth: { username, password },
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  socket.on('connect', () => {
    console.log('Socket connected successfully');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket || !socket.connected) {
    console.warn('Socket is not connected');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 