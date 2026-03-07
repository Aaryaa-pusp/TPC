const express = require('express');
const {
    getPastRecruiters,
    createPastRecruiter,
    updatePastRecruiter,
    deletePastRecruiter
} = require('../controllers/pastRecruiterController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');
const { upload } = require('../utils/cloudinaryConfig');

const router = express.Router();

router.route('/')
    .get(getPastRecruiters)
    .post(verifyToken, requireRole(['admin']), upload.single('logo'), createPastRecruiter);

router.route('/:id')
    .put(verifyToken, requireRole(['admin']), upload.single('logo'), updatePastRecruiter)
    .delete(verifyToken, requireRole(['admin']), deletePastRecruiter);

module.exports = router;
