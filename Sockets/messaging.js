const { Server } = require('socket.io');
const Message = require('../Models/messageSchema');

function initSocket(server) {
    const io = new Server(server, {
        cors: { origin: '*' },
    });
    // Handle socket connections
    io.on('connection', (socket) => {
        console.log('🟢 New user connected:', socket.id);
        // Join a room based on user ID
        socket.on('join', (roomId) => {
            console.log(`User ${roomId} joined`);
            socket.join(roomId);
        });
        // Handle message sending
        socket.on('send_message', async (data) => {
            console.log(data,"data==>");
            const { sender, receiver, message } = data;
            console.log(`Message from ${sender} to ${receiver}: ${message}`);
            try {
                const roomId = [sender, receiver].sort().join('_');
                const newMsg = new Message({ roomId, sender, receiver, message });
                await newMsg.save();
                // Emit the message to the receiver's room
                socket.to(roomId).emit('receive_message', newMsg);
            } catch (err) {
                console.error('Socket error:', err.message);
                socket.emit('error_message', 'Internal error.');
            }
        });
        // Handle user disconnection
        socket.on('disconnect', () => {
            console.log('🔴 User disconnected:', socket.id);
        });
    });
};
module.exports = { initSocket, };