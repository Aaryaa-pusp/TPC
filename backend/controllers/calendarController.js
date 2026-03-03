const Event = require('../models/Event');
const Announcement = require('../models/Announcement');

exports.getUnifiedCalendar = async (req, res) => {
    try {
        // If student is logged in, their data is in req.user
        // Or we can accept branch from query. We'll use query for flexibility, fallback to req.user if present
        let userBranch = req.query.branch;

        // As a fallback, if req.user has a department/branch, use that
        if (!userBranch && req.user && req.user.department) {
            userBranch = req.user.department;
        }

        const query = {};
        if (userBranch) {
            query.targetBranches = { $in: [new RegExp(`^${userBranch}$`, 'i'), /^all$/i] };
        }

        const [events, announcements] = await Promise.all([
            Event.find(query),
            Announcement.find(query)
        ]);

        const calendarItems = [];

        events.forEach(event => {
            let color = '#3b82f6'; // Blue for internships/events
            if (event.type === 'placement_drive') {
                color = '#8b5cf6'; // Purple for placements
            } else if (event.type === 'workshop') {
                color = '#10b981'; // Emerald/Green for workshops
            }

            calendarItems.push({
                title: event.title,
                start: event.date ? new Date(event.date).toISOString() : null,
                type: event.type,
                color: color,
                extendedProps: event.toObject()
            });
        });

        announcements.forEach(ann => {
            calendarItems.push({
                title: ann.title,
                start: ann.createdAt ? new Date(ann.createdAt).toISOString() : null,
                type: 'announcement',
                color: '#f59e0b', // Amber for announcements
                extendedProps: ann.toObject()
            });
        });

        res.status(200).json({ calendar: calendarItems });
    } catch (err) {
        console.error('getUnifiedCalendar Error:', err);
        res.status(500).json({ message: 'Internal server error while fetching unified calendar' });
    }
};
