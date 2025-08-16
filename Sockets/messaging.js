const { Server } = require('socket.io');
const Message = require('../Models/messageSchema');
const userModal = require('../Models/userSchema');
const { getRecentChats } = require('../utils/aggrigation');
const { sendNotification } = require('../utils/Notification');

const activeUsers = {};
function initSocket(server) {
    const io = new Server(server, {
        cors: { origin: '*' },
    });

    // Handle socket connections
    io.on('connection', (socket) => {
        console.log('🟢 New user connected:', socket.id);
        // Join a room based on user ID
        socket.on('join', ({ userId, roomId }) => {
            console.log(`User ${userId} joined ${roomId}`);
            socket.join(roomId);
            if (!!userId) {
                activeUsers[userId] = roomId;
            }
            const usersInRoom = Object.entries(activeUsers)
                .filter(([_, room_Id]) => room_Id === roomId)
                .map(([userId]) => userId);
            io.to(roomId).emit('active_user', usersInRoom);
        });
        // leave a room based on user ID
        socket.on('leave_room', ({ userId, roomId }) => {
            console.log(`User ${userId} leaved ${roomId}`);
            socket.leave(roomId);
            if (!!userId) {
                delete activeUsers[userId];
            }
            const usersInRoom = Object.entries(activeUsers)
                .filter(([_, room_Id]) => room_Id === roomId)
                .map(([userId]) => userId);
            io.to(roomId).emit('active_user', usersInRoom);
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
                if (activeUsers[receiver] != roomId && sender != receiver) {
                    const receiverToken = await userModal.findById(receiver, { deviceInfo: 1 });
                    const senderName = await userModal.findById(sender, { name: 1 });
                    if (!!receiverToken) sendNotification(senderName.name, message, receiverToken.token);
                }
            } catch (err) {
                console.error('Socket error:', err.message);
                socket.emit('error_message', 'Internal error.');
            }
        });

        //typing event
        socket.on("typing", ({ roomId, userId }) => {
            io.to(roomId).emit("typing_status", { userId, isTyping: true });
        });
        socket.on("stop_typing", ({ roomId, userId }) => {
            io.to(roomId).emit("typing_status", { userId, isTyping: false });
        });
        // Handle user disconnection
        socket.on('disconnect', () => {
            console.log('🔴 User disconnected:', socket.id);
        });
    });
};
module.exports = { initSocket, };