const express = require('express');
const connnectDb = require('./Config/db');
const cors = require('cors');
const http = require('http');
const { userRoutes, messageRoutes } = require('./Routes/rootRoute');
const { initSocket } = require('./Sockets/index');
const app = express();

const server = http.createServer(app);

// Middleware setup
app.use(cors());
app.use(express.json());

// Connect to the database
connnectDb();

// Define routes
app.use('/auth', userRoutes);
app.use('/message', messageRoutes);

// Initialize WebSocket
initSocket(server);

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://localhost:3000');
});
