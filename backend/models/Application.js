const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    currentRoundIndex: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: false });

// Ensure one application per student per event
applicationSchema.index({ eventId: 1, studentId: 1 }, { unique: true });
// Fast lookup for student's own applications, newest first
applicationSchema.index({ studentId: 1, updatedAt: -1 });
// Fast lookup for all applicants on an event
applicationSchema.index({ eventId: 1, status: 1, currentRoundIndex: 1 });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
