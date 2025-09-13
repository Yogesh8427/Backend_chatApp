const express = require('express');
const connnectDb = require('./Config/db');
const cors = require('cors');
const http = require('http');
const dotenv = require("dotenv")
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

app.get('/', (req, res) => res.send('✅ Backend is live!'));
// Define routes
app.use('/auth', userRoutes);
app.use('/message', messageRoutes);

// Initialize WebSocket
initSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
