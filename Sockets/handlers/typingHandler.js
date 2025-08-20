function typingHandler(io, socket) {
    socket.on("typing", ({ roomId, userId }) => {
        io.to(roomId).emit("typing_status", { userId, isTyping: true });
    });

    socket.on("stop_typing", ({ roomId, userId }) => {
        io.to(roomId).emit("typing_status", { userId, isTyping: false });
    });
}

module.exports = { typingHandler };
