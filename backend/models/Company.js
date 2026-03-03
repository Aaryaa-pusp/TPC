const mongoose = require('mongoose');
const User = require('./User');

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    companyEmail: {
        type: String,
        required: true,
        unique: true,
    },
    companyWebsite: {
        type: String,
        required: true,
    },
    HRContactName: {
        type: String,
        required: true,
    },
    HRContactEmail: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
    },
    verificationStatus: {
        type: String,
        enum: ['unsubmitted', 'pending', 'verified', 'rejected'],
        default: 'unsubmitted'
    },
    verificationDeadline: {
        type: Date,
        default: () => Date.now() + 48 * 60 * 60 * 1000,
    },
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
});

// Implement MongoDB TTL index 
// The index only applies if verificationStatus is unsubmitted or pending
companySchema.index(
    { verificationDeadline: 1 },
    {
        expireAfterSeconds: 0,
        partialFilterExpression: {
            verificationStatus: { $in: ['unsubmitted', 'pending'] }
        }
    }
);

const Company = User.discriminator('company', companySchema);

module.exports = Company;
