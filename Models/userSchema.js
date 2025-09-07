const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false,
        default: null
    },
    phone: {
        type: String,
        required: false,
        unique: true,
        sparse: true
    },
    image: {
        type: String,
        required: false
    },
    token: {
        type: String
    },
    deviceInfo: {
        deviceId: {
            type: String,
            required: true
        },
        deviceType: {
            type: String,
            enum: ['android', 'ios'],
            required: true
        },
        fcmToken: {
            type: String,
            required: true
        },
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('User', userSchema);
