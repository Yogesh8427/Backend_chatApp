const express = require('express');
const connnectDb = require('./Config/db');
const cors = require('cors');
const http = require('http');
const dotenv= require("dotenv")
const { userRoutes, messageRoutes } = require('./Routes/rootRoute');
const { initSocket } = require('./Sockets/index');
const app = express();

const server = http.createServer(app);
dotenv.config();
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

server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
