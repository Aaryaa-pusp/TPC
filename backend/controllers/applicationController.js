const Application = require('../models/Application');
const Notification = require('../models/Notification');
const Event = require('../models/Event');

const PAGE_SIZE = 6;

/**
 * GET /api/student/applications?page=0
 * Returns the logged-in student's applied events, paginated, newest first.
 */
exports.getMyApplications = async (req, res) => {
    try {
        const studentId = req.user.userId;
        const page = parseInt(req.query.page, 10) || 0;
        const skip = page * PAGE_SIZE;

        const total = await Application.countDocuments({ studentId });

        const applications = await Application.find({ studentId })
            .sort({ updatedAt: -1 })
            .skip(skip)
            .limit(PAGE_SIZE)
            .populate({
                path: 'eventId',
                select: 'title type status rounds startDate endDate',
            })
            .lean();

        // Apply auto-rejection display logic
        const now = new Date();
        const enriched = applications.map(app => {
            const event = app.eventId;
            let effectiveStatus = app.status;
            if (event && event.rounds) {
                const round = event.rounds[app.currentRoundIndex];
                if (round && round.endDate && new Date(round.endDate) < now && app.status === 'pending') {
                    effectiveStatus = 'auto_rejected';
                }
            }
            return { ...app, effectiveStatus };
        });

        res.status(200).json({
            applications: enriched,
            total,
            page,
            totalPages: Math.ceil(total / PAGE_SIZE),
        });
    } catch (err) {
        console.error('getMyApplications Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * GET /api/student/applications/:eventId/history
 * Returns all Notification docs for a student+event, newest first.
 */
exports.getApplicationHistory = async (req, res) => {
    try {
        const studentId = req.user.userId;
        const { eventId } = req.params;

        const notifications = await Notification.find({ studentId, eventId })
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({ notifications });
    } catch (err) {
        console.error('getApplicationHistory Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
