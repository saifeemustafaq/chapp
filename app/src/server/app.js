const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const setupSocket = require('./services/socketService');
const { initializeUsers, setupInitialPasswords, getUsers } = require('./controllers/authController');

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

// Initialize users
initializeUsers();
setupInitialPasswords();

// Setup routes
app.use('/auth', authRoutes);

// Setup socket
setupSocket(io, getUsers);

module.exports = { app, server }; 