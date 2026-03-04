const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Student applies to an event
router.patch('/:eventId/apply', verifyToken, requireRole(['student']), eventController.applyToEvent);

module.exports = router;
