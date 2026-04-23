const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Student applies to an event
router.patch('/:eventId/apply', verifyToken, requireRole(['student']), eventController.applyToEvent);

// Company/Admin: get paginated applicants for a specific event
router.get('/:eventId/applicants', verifyToken, requireRole(['company', 'admin']), eventController.getEventApplicants);

// Company/Admin: accept or reject a specific application
router.post('/application/:applicationId/action', verifyToken, requireRole(['company', 'admin']), eventController.applicantAction);

module.exports = router;
