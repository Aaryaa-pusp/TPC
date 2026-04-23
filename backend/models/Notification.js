const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: false });

// Fast lookup for student notification history per event, newest first
notificationSchema.index({ studentId: 1, eventId: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
