const Event = require('../models/Event');
const User = require('../models/User');

exports.applyToEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user.userId;

        // Look up the student's email from the User collection
        const user = await User.findById(userId).select('email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const studentEmail = user.email;

        // Find the event and ensure it exists
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if the event is still active or upcoming (not past)
        const now = new Date();
        if (event.endDate && event.endDate < now) {
            return res.status(400).json({ message: 'Cannot apply to a past event' });
        }

        // Use $addToSet to avoid duplicate entries
        const updatedEvent = await Event.findByIdAndUpdate(
            eventId,
            { $addToSet: { appliedStudents: studentEmail } },
            { new: true }
        );

        res.status(200).json({
            message: 'Application recorded successfully',
            event: updatedEvent,
        });
    } catch (err) {
        console.error('applyToEvent Error:', err);
        res.status(500).json({ message: 'Internal server error while applying to event' });
    }
};
