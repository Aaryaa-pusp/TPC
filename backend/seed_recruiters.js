const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PastRecruiter = require('./models/PastRecruiter');

dotenv.config();

const recruitersList = [
    { name: 'Google', industry: 'Software/Technology', tier: 'Tier 1' },
    { name: 'Microsoft', industry: 'Software/Technology', tier: 'Tier 1' },
    { name: 'Amazon', industry: 'E-commerce/Tech', tier: 'Tier 1' },
    { name: 'Atlassian', industry: 'Software/Technology', tier: 'Tier 1' },
    { name: 'Goldman Sachs', industry: 'Finance/Tech', tier: 'Tier 1' },
    { name: 'Samsung', industry: 'Electronics/Tech', tier: 'Tier 1' },
    { name: 'Oracle', industry: 'Software/Technology', tier: 'Tier 1' },
    { name: 'Adobe', industry: 'Digital Media', tier: 'Tier 1' },
    { name: 'Apple', industry: 'Technology', tier: 'Tier 1' },
    { name: 'Meta', industry: 'Social Media/Tech', tier: 'Tier 1' },
    { name: 'Netflix', industry: 'Entertainment/Tech', tier: 'Tier 1' },
    { name: 'LinkedIn', industry: 'Social Network', tier: 'Tier 1' },
    { name: 'Intuit', industry: 'Software/Technology', tier: 'Tier 1' },
    { name: 'Salesforce', industry: 'Software/Technology', tier: 'Tier 1' },
    { name: 'Cisco', industry: 'Networking/Tech', tier: 'Tier 1' },
    { name: 'IBM', industry: 'Hardware/Software', tier: 'Tier 1' },
    { name: 'Intel', industry: 'Semiconductors', tier: 'Tier 1' },
    { name: 'AMD', industry: 'Semiconductors', tier: 'Tier 1' },
    { name: 'Nvidia', industry: 'Semiconductors/AI', tier: 'Tier 1' },
    { name: 'Qualcomm', industry: 'Semiconductors', tier: 'Tier 1' },
    { name: 'Broadcom', industry: 'Semiconductors', tier: 'Tier 2' },
    { name: 'Texas Instruments', industry: 'Semiconductors', tier: 'Tier 2' },
    { name: 'Walmart Global Tech', industry: 'Retail/Tech', tier: 'Tier 1' },
    { name: 'Target', industry: 'Retail/Tech', tier: 'Tier 2' },
    { name: 'Flipkart', industry: 'E-commerce', tier: 'Tier 1' },
    { name: 'Myntra', industry: 'E-commerce', tier: 'Tier 2' },
    { name: 'Paytm', industry: 'Fintech', tier: 'Tier 2' },
    { name: 'PhonePe', industry: 'Fintech', tier: 'Tier 1' },
    { name: 'Razorpay', industry: 'Fintech', tier: 'Tier 1' },
    { name: 'CRED', industry: 'Fintech', tier: 'Tier 1' },
    { name: 'Uber', industry: 'Mobility/Tech', tier: 'Tier 1' },
    { name: 'Lyft', industry: 'Mobility/Tech', tier: 'Tier 2' },
    { name: 'Airbnb', industry: 'Hospitality/Tech', tier: 'Tier 1' },
    { name: 'Booking.com', industry: 'Travel/Tech', tier: 'Tier 2' },
    { name: 'Expedia', industry: 'Travel/Tech', tier: 'Tier 2' },
    { name: 'DE Shaw', industry: 'Quantitative Finance', tier: 'Tier 1' },
    { name: 'Tower Research', industry: 'Quantitative Finance', tier: 'Tier 1' },
    { name: 'Optiver', industry: 'Quantitative Finance', tier: 'Tier 1' },
    { name: 'Jane Street', industry: 'Quantitative Finance', tier: 'Tier 1' },
    { name: 'Two Sigma', industry: 'Quantitative Finance', tier: 'Tier 1' },
    { name: 'Morgan Stanley', industry: 'Investment Banking', tier: 'Tier 1' },
    { name: 'J.P. Morgan', industry: 'Investment Banking', tier: 'Tier 1' },
    { name: 'Barclays', industry: 'Investment Banking', tier: 'Tier 2' },
    { name: 'Citi', industry: 'Investment Banking', tier: 'Tier 2' },
    { name: 'American Express', industry: 'Finance', tier: 'Tier 2' },
    { name: 'Visa', industry: 'Payment/Tech', tier: 'Tier 1' },
    { name: 'Mastercard', industry: 'Payment/Tech', tier: 'Tier 1' },
    { name: 'PayPal', industry: 'Payment/Tech', tier: 'Tier 1' },
    { name: 'Stripe', industry: 'Payment/Tech', tier: 'Tier 1' },
    { name: 'Square', industry: 'Payment/Tech', tier: 'Tier 2' },
].sort((a, b) => a.name.localeCompare(b.name));

const seedRecruiters = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tpc-portal';
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        await PastRecruiter.deleteMany();
        console.log('Cleared existing recruiters');

        await PastRecruiter.insertMany(recruitersList);
        console.log(`Successfully seeded ${recruitersList.length} recruiters`);

        process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        process.exit(1);
    }
};

seedRecruiters();
