const Message = require("../../Models/messageSchema");
const userModal = require("../../Models/userSchema");
const { getRecentChats } = require("../../utils/aggrigation");
const { sendNotification } = require("../../utils/Notification");
const { getActiveRoom } = require("../utils/activeUsers");

function messageHandler(io, socket) {
    socket.on("send_message", async ({ sender, receiver, message }) => {
        try {
            console.log("working")
            const roomId = [sender, receiver].sort().join("_");
            const newMsg = new Message({ roomId, sender, receiver, message, isRead: false });
            console.log(newMsg,"hhhhh")
            await newMsg.save();

            io.to(roomId).emit("receive_message", newMsg);

            const senderChats = await getRecentChats(sender);
            const receiverChats = await getRecentChats(receiver);
            io.to(sender).emit("recent_chats", senderChats);
            io.to(receiver).emit("recent_chats", receiverChats);

            if (getActiveRoom(receiver) !== roomId && sender !== receiver) {
                const receiverToken = await userModal.findById(receiver, { deviceInfo: 1 });
                const senderName = await userModal.findById(sender, { name: 1 });

                if (receiverToken?.deviceInfo?.fcmToken) {
                    sendNotification(senderName.name, message, receiverToken.deviceInfo.fcmToken);
                }
            }
        } catch (err) {
            console.error("send_message error:", err.message);
            socket.emit("error_message", "Internal error.");
        }
    });

    socket.on("mark_as_read", async ({ roomId, userId, messageId }) => {
        try {
            const msg = await Message.findById(messageId);
            if (msg && !msg.isRead) {
                msg.isRead = true;
                await msg.save();

                io.to(roomId).emit("read_update", { messageId: msg._id, isRead: true });

                const receiverChats = await getRecentChats(userId);
                io.to(userId).emit("recent_chats", receiverChats);
            }
        } catch (err) {
            console.error("mark_as_read error:", err.message);
        }
    });
}

module.exports = { messageHandler };
