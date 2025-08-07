const { Server } = require('socket.io');
const Message = require('../Models/messageSchema');
const { getRecentChats } = require('../utils/aggrigation');
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
            const { sender, receiver, message } = data;
            try {
                const roomId = [sender, receiver].sort().join('_');
                const newMsg = new Message({ roomId, sender, receiver, message });
                await newMsg.save();

                // Emit the message to the receiver's room
                socket.to(roomId).emit('receive_message', newMsg);

                // Get updated recent chats for both sender and receiver
                const senderChats = await getRecentChats(sender);
                const receiverChats = await getRecentChats(receiver);

                // Emit updated recent chats to both
                io.to(sender).emit('recent_chats', senderChats);
                io.to(receiver).emit('recent_chats', receiverChats);

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