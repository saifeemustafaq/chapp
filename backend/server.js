const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcrypt');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const USERS_FILE = path.join(__dirname, 'users.json');
let users = [];

const messages = [];

function loadUsers() {
  console.log('Loading users from file');
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  users = JSON.parse(data).users;
  console.log('Users loaded:', users.map(u => u.username));
}

function saveUsers() {
  console.log('Saving users to file');
  fs.writeFileSync(USERS_FILE, JSON.stringify({ users }, null, 2));
  console.log('Users saved');
}

loadUsers();

io.use(async (socket, next) => {
  const { username, password } = socket.handshake.auth;
  console.log(`Socket authentication attempt for user: ${username}`);
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

  socket.emit('chatHistory', messages);

  socket.on('changeColor', (newColor) => {
    const user = users.find(u => u.username === socket.username);
    if (user) {
      user.color = newColor;
      io.emit('userColorChanged', { username: socket.username, newColor });
    }
  });

  socket.on('sendMessage', (message) => {
    console.log(`Message received from ${socket.username}:`, message);
    const user = users.find(u => u.username === socket.username);
    const newMessage = { 
      user: socket.username, 
      text: message, // This will preserve multiline content
      color: user.color
    };
    messages.push(newMessage);
    console.log('Broadcasting new message');
    io.emit('newMessage', newMessage);
  });

  socket.on('deleteChat', () => {
    console.log(`Delete chat request from ${socket.username}`);
    messages.length = 0;
    console.log('Chat deleted, notifying all clients');
    io.emit('chatDeleted');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.username);
  });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Login attempt for user: ${username}`);
  const user = users.find(u => u.username === username);
  if (!user) {
    console.log(`User not found: ${username}`);
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    console.log(`Invalid password for user: ${username}`);
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
  console.log(`Successful login for user: ${username}`);
  res.json({ success: true, color: user.color });
});

app.post('/change-password', async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  console.log(`Password change attempt for user: ${username}`);
  const user = users.find(u => u.username === username);
  if (!user) {
    console.log(`User not found: ${username}`);
    return res.status(401).json({ success: false, message: 'Invalid username' });
  }
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    console.log(`Invalid current password for user: ${username}`);
    return res.status(401).json({ success: false, message: 'Invalid current password' });
  }
  const newHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = newHash;
  saveUsers();
  console.log(`Password changed successfully for user: ${username}`);
  res.json({ success: true, message: 'Password changed successfully' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Initial password setup (run this once to set up initial passwords)
async function setupInitialPasswords() {
  for (let user of users) {
    if (!user.passwordHash) {
      user.passwordHash = await bcrypt.hash(user.username + '123', 10); // Default password is username + '123'
    }
  }
  saveUsers();
}

setupInitialPasswords();