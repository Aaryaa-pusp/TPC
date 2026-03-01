const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole, checkAdminRole } = require('../middleware/authMiddleware');

router.use(verifyToken, requireRole(['admin'])); // All routes require admin

router.get('/companies/pending', checkAdminRole(['super_admin']), adminController.getPendingCompanies);
router.put('/companies/:companyId/verify', checkAdminRole(['super_admin']), adminController.verifyCompany);

// Student Verification Routes
router.get('/students/pending', checkAdminRole(['super_admin', 'student_admin']), adminController.getPendingStudents);
router.put('/students/:studentId/verify', checkAdminRole(['super_admin', 'student_admin']), adminController.verifyStudentData);
router.post('/assign-power', checkAdminRole(['super_admin', 'announcement_admin', 'student_admin']), adminController.assignAdminPower);
router.post('/events', checkAdminRole(['super_admin', 'student_admin']), adminController.createEvent);

// Announcements Routes
router.get('/announcements', checkAdminRole(['super_admin', 'announcement_admin']), adminController.getAnnouncements);
router.post('/announcements', checkAdminRole(['super_admin', 'announcement_admin']), adminController.createAnnouncement);
router.put('/announcements/:id', checkAdminRole(['super_admin', 'announcement_admin']), adminController.updateAnnouncement);
router.delete('/announcements/:id', checkAdminRole(['super_admin', 'announcement_admin']), adminController.deleteAnnouncement);

module.exports = router;
