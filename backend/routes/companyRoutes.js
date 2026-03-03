const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { verifyToken, requireRole, isCompanyVerified } = require('../middleware/authMiddleware');

// Get filtered students, accessible only to verified companies (or admins)
router.get('/students', verifyToken, requireRole(['company', 'admin']), isCompanyVerified, companyController.getStudents);
router.post('/verify', verifyToken, requireRole(['company']), companyController.submitVerification);
router.put('/profile', verifyToken, requireRole(['company']), companyController.updateProfile);

module.exports = router;
