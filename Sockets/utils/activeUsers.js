const activeUsers = {};

function addUser(userId, roomId) {
    activeUsers[userId] = roomId;
}

function removeUser(userId) {
    delete activeUsers[userId];
}

function getUsersInRoom(roomId) {
    return Object.entries(activeUsers)
        .filter(([_, room_Id]) => room_Id === roomId)
        .map(([userId]) => userId);
}

function getActiveRoom(userId) {
    return activeUsers[userId];
}

module.exports = {
    addUser,
    removeUser,
    getUsersInRoom,
    getActiveRoom,
};
