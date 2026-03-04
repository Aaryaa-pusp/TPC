const Event = require('../models/Event');
const Announcement = require('../models/Announcement');

exports.getUnifiedCalendar = async (req, res) => {
    try {
        let userBranch = req.query.branch;

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
            const eventObj = event.toObject();
            calendarItems.push({
                id: eventObj._id,
                title: event.title,
                start: event.startDate ? new Date(event.startDate).toISOString() : (event.date ? new Date(event.date).toISOString() : null),
                end: event.endDate ? new Date(event.endDate).toISOString() : (event.startDate ? new Date(event.startDate).toISOString() : null),
                type: event.type,
                appliedStudents: event.appliedStudents || [],
                extendedProps: {
                    ...eventObj,
                    links: event.links || [],
                }
            });
        });

        announcements.forEach(ann => {
            calendarItems.push({
                id: ann._id,
                title: ann.title,
                start: ann.createdAt ? new Date(ann.createdAt).toISOString() : null,
                end: ann.createdAt ? new Date(ann.createdAt).toISOString() : null,
                type: 'announcement',
                appliedStudents: [],
                extendedProps: ann.toObject()
            });
        });

        res.status(200).json({ calendar: calendarItems });
    } catch (err) {
        console.error('getUnifiedCalendar Error:', err);
        res.status(500).json({ message: 'Internal server error while fetching unified calendar' });
    }
};
