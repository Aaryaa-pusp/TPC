const express = require('express');
const Developer = require('../models/Developer');
const router = express.Router();

// GET all public developers
router.get('/', async (req, res) => {
    try {
        const developers = await Developer.find({ isPublic: true });
        res.status(200).json(developers);
    } catch (error) {
        console.error('Error fetching developers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
