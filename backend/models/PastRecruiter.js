const mongoose = require('mongoose');

const pastRecruiterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the company name'],
        trim: true,
        maxlength: [100, 'Company name cannot be more than 100 characters']
    },
    industry: {
        type: String,
        required: [true, 'Please provide the industry'],
        trim: true
    },
    logoUrl: {
        type: String,
        trim: true,
        default: ''
    },
    tier: {
        type: String,
        enum: ['Tier 1', 'Tier 2', 'Tier 3'],
        default: 'Tier 1'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('PastRecruiter', pastRecruiterSchema);
