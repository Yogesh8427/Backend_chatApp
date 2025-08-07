const express = require('express');
const connnectDb = require('./Config/db');
const cors = require('cors');
const http = require('http');
const { userRoutes ,messageRoutes} = require('./Routes/rootRoute');
const {initSocket} = require('./Sockets/messaging')
const app = express();
const server = http.createServer(app);
app.use(cors());
app.use(express.json());
connnectDb();
app.use('/auth', userRoutes);
app.use('/message', messageRoutes);
initSocket(server);
server.listen(3000,'0.0.0.0',() => {
  console.log('Server running on http://localhost:3000');
});
