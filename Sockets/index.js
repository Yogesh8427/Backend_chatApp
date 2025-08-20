const { Server } = require("socket.io");
const {roomHandler} = require("./handlers/roomHandler");
const {messageHandler} = require("./handlers/messageHandler");
const {typingHandler} = require("./handlers/typingHandler");
const {disconnectHandler} = require("./handlers/disconnectHandler");

function initSocket(server) {
    const io = new Server(server, {
        cors: { origin: "*" },
    });

    io.on("connection", (socket) => {
        console.log("🟢 New user connected:", socket.id);

        // Attach feature handlers
        roomHandler(io, socket);
        messageHandler(io, socket);
        typingHandler(io, socket);
        disconnectHandler(socket);
    });
}

module.exports = { initSocket };