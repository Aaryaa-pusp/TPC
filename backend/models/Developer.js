const mongoose = require('mongoose');

const DeveloperSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    roll: {
        type: String, 
        required: true,
    },
    image: {
        type: String, 
        required: true,
    },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    isPublic: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Developer', DeveloperSchema);
