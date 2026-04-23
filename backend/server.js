require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://tpc-portal.vercel.app',
    ],
    credentials: true,
}));
app.use(express.json());

// Routes will be imported here
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const companyRoutes = require('./routes/companyRoutes');
const studentRoutes = require('./routes/studentRoutes');
const developerRoutes = require('./routes/developerRoutes');
const eventRoutes = require('./routes/eventRoutes');
const pastRecruiterRoutes = require('./routes/pastRecruiterRoutes');

// Ensure all models (including discriminators) are registered at startup
require('./models/Application');
require('./models/Notification');
require('./models/Student'); // Student is a User discriminator — must register before any populate

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/developers', developerRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/past-recruiters', pastRecruiterRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'API is running' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tpc-portal';

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    });
