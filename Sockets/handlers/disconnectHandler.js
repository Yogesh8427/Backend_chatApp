function disconnectHandler(socket) {
    socket.on("disconnect", () => {
        console.log("🔴 User disconnected:", socket.id);
    });
}

module.exports = { disconnectHandler };
