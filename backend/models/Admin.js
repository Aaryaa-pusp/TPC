const mongoose = require('mongoose');
const User = require('./User');

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    adminType: {
        type: String,
        enum: ['super_admin', 'announcement_admin', 'student_admin'],
        required: true,
    },
    status: {
        type: String,
        default: 'active',
    }
});

adminSchema.index({ adminType: 1 });

const Admin = User.discriminator('admin', adminSchema);

module.exports = Admin;
