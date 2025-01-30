const bcrypt = require('bcrypt');
const { SOCKET_EVENTS } = require('../../shared/constants');

const messages = [];

const setupSocket = (io, getUsers) => {
  io.use(async (socket, next) => {
    const { username, password } = socket.handshake.auth;
    console.log(`Socket authentication attempt for user: ${username}`);
    const users = getUsers();
    const user = users.find(u => u.username === username);
    
    if (!user) {
      console.log(`User not found: ${username}`);
      return next(new Error('Invalid username or password'));
    }
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      console.log(`Invalid password for user: ${username}`);
      return next(new Error('Invalid username or password'));
    }
    
    console.log(`Socket authenticated for user: ${username}`);
    socket.username = username;
    next();
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.username);

    socket.emit(SOCKET_EVENTS.CHAT_HISTORY, messages);

    socket.on(SOCKET_EVENTS.CHANGE_COLOR, (newColor) => {
      const users = getUsers();
      const user = users.find(u => u.username === socket.username);
      if (user) {
        user.color = newColor;
        io.emit(SOCKET_EVENTS.USER_COLOR_CHANGED, { username: socket.username, newColor });
      }
    });

    socket.on(SOCKET_EVENTS.SEND_MESSAGE, (message) => {
      console.log(`Message received from ${socket.username}:`, message);
      const users = getUsers();
      const user = users.find(u => u.username === socket.username);
      const newMessage = { 
        user: socket.username, 
        text: message,
        color: user.color,
        timestamp: new Date().toISOString()
      };
      messages.push(newMessage);
      console.log('Broadcasting new message');
      io.emit(SOCKET_EVENTS.NEW_MESSAGE, newMessage);
    });

    socket.on(SOCKET_EVENTS.DELETE_CHAT, () => {
      console.log(`Delete chat request from ${socket.username}`);
      messages.length = 0;
      console.log('Chat deleted, notifying all clients');
      io.emit(SOCKET_EVENTS.CHAT_DELETED);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.username);
    });
  });
};

module.exports = setupSocket; 