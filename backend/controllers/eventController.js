const Event = require('../models/Event');
const User = require('../models/User');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
// Student is a discriminator of User — require it so the model gets registered
require('../models/Student');

/**
 * POST /api/events/:eventId/apply
 * Student applies to an event. Creates an Application doc and also pushes
 * the email into Event.appliedStudents for backward compatibility.
 */
exports.applyToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.userId;

        const user = await User.findById(userId).select('email');
        if (!user) return res.status(404).json({ message: 'User not found' });

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const now = new Date();
        if (event.endDate && event.endDate < now) {
            return res.status(400).json({ message: 'Cannot apply to a past event' });
        }

        // Backward-compat: push email into appliedStudents
        await Event.findByIdAndUpdate(
            eventId,
            { $addToSet: { appliedStudents: user.email } },
            { new: true }
        );

        // Upsert Application doc — creates if not exists, returns existing if already there
        let application = await Application.findOneAndUpdate(
            { studentId: userId, eventId },
            {
                $setOnInsert: {
                    studentId: userId,
                    eventId,
                    currentRoundIndex: 0,
                    status: 'pending',
                    updatedAt: new Date(),
                }
            },
            { upsert: true, new: true }
        );

        // Only create a notification if this is a genuinely new application
        // Check by seeing if any notification already exists for this student+event
        const existingNotification = await Notification.findOne({ studentId: userId, eventId });
        if (!existingNotification) {
            await Notification.create({
                studentId: userId,
                eventId,
                message: `You have successfully applied to "${event.title}". Your application is under review.`,
            });
        }

        res.status(200).json({
            message: 'Application recorded successfully',
            application,
        });
    } catch (err) {
        console.error('applyToEvent Error:', err);
        res.status(500).json({ message: 'Internal server error while applying to event' });
    }
};

/**
 * GET /api/events/:eventId/applicants
 * Company/Admin fetches paginated applicants for an event.
 * Supports: ?page=0&roundIndex=0&search=name|roll&branch=CSE&year=2nd Year
 * Auto-rejection: if now > round.endDate && status==='pending' → treated as rejected in response.
 */
exports.getEventApplicants = async (req, res) => {
    try {
        const { eventId } = req.params;
        const {
            page = 0,
            roundIndex,
            search,
            branch,
            year,
        } = req.query;

        const event = await Event.findById(eventId).lean();
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Build application query
        const appQuery = { eventId };
        if (roundIndex !== undefined && roundIndex !== '') {
            appQuery.currentRoundIndex = parseInt(roundIndex, 10);
        }

        const PAGE_SIZE = 6;
        const skip = parseInt(page, 10) * PAGE_SIZE;

        // Fetch applications matching round filter
        // We explicitly specify model:'User' because Student is a discriminator of User
        // and populate() must resolve to the shared 'users' collection.
        let applications = await Application.find(appQuery)
            .sort({ updatedAt: -1 })
            .populate({
                path: 'studentId',
                model: 'User',
                select: 'fullName email rollNumber department program currentYearOfStudy cgpa resumeLink profilePicture verificationStatus',
            })
            .lean();

        // Apply auto-rejection logic per-application
        const now = new Date();
        applications = applications.map(app => {
            const roundIdx = app.currentRoundIndex;
            const round = event.rounds && event.rounds[roundIdx];
            let effectiveStatus = app.status;
            if (round && round.endDate && new Date(round.endDate) < now && app.status === 'pending') {
                effectiveStatus = 'auto_rejected';
            }
            return { ...app, effectiveStatus };
        });

        // Search filter (applied in-memory after populate)
        let filtered = applications;
        if (search && search.trim()) {
            const q = search.trim().toLowerCase();
            filtered = filtered.filter(app => {
                const s = app.studentId;
                if (!s) return false;
                return (
                    (s.fullName && s.fullName.toLowerCase().includes(q)) ||
                    (s.rollNumber && s.rollNumber.toLowerCase().includes(q)) ||
                    (s.email && s.email.toLowerCase().includes(q))
                );
            });
        }

        if (branch && branch.trim()) {
            filtered = filtered.filter(app =>
                app.studentId && app.studentId.department === branch.trim()
            );
        }

        if (year && year.trim()) {
            filtered = filtered.filter(app =>
                app.studentId && app.studentId.currentYearOfStudy === year.trim()
            );
        }

        const total = filtered.length;
        const paginated = filtered.slice(skip, skip + PAGE_SIZE);

        res.status(200).json({
            applicants: paginated,
            total,
            page: parseInt(page, 10),
            totalPages: Math.ceil(total / PAGE_SIZE),
            event: { title: event.title, rounds: event.rounds || [] },
        });
    } catch (err) {
        console.error('getEventApplicants Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * POST /api/events/:applicationId/action
 * Company accepts or rejects an applicant at their current round.
 * action: 'accept' | 'reject'
 */
exports.applicantAction = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { action } = req.body;

        if (!['accept', 'reject'].includes(action)) {
            return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
        }

        const application = await Application.findById(applicationId);
        if (!application) return res.status(404).json({ message: 'Application not found' });

        const event = await Event.findById(application.eventId).lean();
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const rounds = event.rounds || [];
        const currentRound = rounds[application.currentRoundIndex];
        const roundLabel = currentRound ? currentRound.title : `Round ${application.currentRoundIndex + 1}`;

        let notificationMessage = '';

        if (action === 'accept') {
            const nextRoundIndex = application.currentRoundIndex + 1;
            if (nextRoundIndex >= rounds.length) {
                // No more rounds — fully accepted
                application.status = 'accepted';
                notificationMessage = `Congratulations! You have been selected for "${event.title}". You have cleared all recruitment rounds.`;
            } else {
                // Move to next round (still pending)
                application.currentRoundIndex = nextRoundIndex;
                application.status = 'pending';
                const nextRound = rounds[nextRoundIndex];
                notificationMessage = `You have been shortlisted for the next round in "${event.title}". You cleared "${roundLabel}" and are now in "${nextRound.title}".`;
            }
        } else {
            // reject
            application.status = 'rejected';
            notificationMessage = `We regret to inform you that your application for "${event.title}" has been rejected after "${roundLabel}".`;
        }

        application.updatedAt = new Date();
        await application.save();

        // Create notification entry
        await Notification.create({
            studentId: application.studentId,
            eventId: application.eventId,
            message: notificationMessage,
        });

        res.status(200).json({
            message: `Applicant ${action === 'accept' ? 'accepted' : 'rejected'} successfully`,
            application,
        });
    } catch (err) {
        console.error('applicantAction Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
