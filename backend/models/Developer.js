const mongoose = require('mongoose');

const DeveloperSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String, // e.g., 'Full Stack Engineer', 'Backend Specialist'
        required: true,
    },
    specialTag: {
        type: String, // e.g., 'React Node.js', 'Chomu Level: Max'
        required: false,
    },
    image: {
        type: String, // URL to Cloudinary or S3
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
