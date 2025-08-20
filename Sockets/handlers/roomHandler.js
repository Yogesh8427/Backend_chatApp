const { addUser, removeUser, getUsersInRoom } = require("../utils/activeUsers");

function roomHandler(io, socket) {
    socket.on("join", ({ userId, roomId }) => {
        socket.join(roomId);
        if (userId) addUser(userId, roomId);

        io.to(roomId).emit("active_user", getUsersInRoom(roomId));
    });

    socket.on("leave_room", ({ userId, roomId }) => {
        socket.leave(roomId);
        if (userId) removeUser(userId);

        io.to(roomId).emit("active_user", getUsersInRoom(roomId));
    });
}

module.exports = { roomHandler };
