const mongoose = require('mongoose');
const User = require('./User');

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    rollNumber: {
        type: String,
        required: true,
        unique: true,
    },
    department: {
        type: String,
        required: true,
    },
    program: {
        type: String,
        enum: ['B.Tech', 'M.Tech', 'M.Sc'],
        required: true,
    },
    graduationYear: {
        type: Number,
        required: true,
    },
    currentYearOfStudy: {
        type: String,
        enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'],
    },
    institute: {
        type: String,
        default: 'IIT Patna',
    },
    phoneNumber: {
        type: String,
    },
    cgpa: {
        type: Number,
    },
    idCardUrl: {
        type: String,
    },
    resumeLink: {
        type: String,
    },
    verificationStatus: {
        type: String,
        enum: ['unsubmitted', 'pending', 'verified', 'rejected'],
        default: 'unsubmitted'
    }
});

studentSchema.index({ program: 1, department: 1, currentYearOfStudy: 1 });

const Student = User.discriminator('student', studentSchema);

module.exports = Student;
