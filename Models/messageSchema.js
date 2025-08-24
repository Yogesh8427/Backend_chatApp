const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        index: true   // index for faster room queries
    },
    sender: { type: String, index: true },
    receiver: { type: String, index: true },
    message: String,
    timestamp: { type: Date, default: Date.now, index: -1 }, // descending index on time
    isRead: { type: Boolean, index: true }
});

// Compound indexes for performance
messageSchema.index({ roomId: 1, timestamp: -1 });
messageSchema.index({ receiver: 1, isRead: 1 });
messageSchema.index({ sender: 1, receiver: 1, timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);