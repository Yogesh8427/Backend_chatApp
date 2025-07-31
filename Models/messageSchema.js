const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    sender: String,
    receiver: String,
    message: String,
    timestamp: { type: Date, default: Date.now },
});
module.exports = mongoose.model('Message', messageSchema);
