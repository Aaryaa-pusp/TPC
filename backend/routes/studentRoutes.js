const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const calendarController = require('../controllers/calendarController');
const applicationController = require('../controllers/applicationController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinaryConfig');

router.get('/events', verifyToken, requireRole(['student', 'admin']), studentController.getEvents);
router.get('/announcements', verifyToken, requireRole(['student', 'admin']), studentController.getAnnouncements);

router.get('/calendar', verifyToken, requireRole(['student', 'admin']), calendarController.getUnifiedCalendar);

// Applied Opportunities
router.get('/applications', verifyToken, requireRole(['student']), applicationController.getMyApplications);
router.get('/applications/:eventId/history', verifyToken, requireRole(['student']), applicationController.getApplicationHistory);

router.post('/verify', verifyToken, requireRole(['student']), upload.single('idCard'), studentController.submitVerification);
router.put('/profile', verifyToken, requireRole(['student']), upload.fields([{ name: 'resume', maxCount: 1 }, { name: 'profilePicture', maxCount: 1 }]), studentController.updateProfile);

module.exports = router;

