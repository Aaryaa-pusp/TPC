const Student = require('../models/Student');
const Company = require('../models/Company');

exports.getStudents = async (req, res) => {
    const Event = require('../models/Event');
    try {
        const { cgpa, branch, program, eventId } = req.query;
        const companyId = req.user.userId;

        // Find Company
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        let appliedStudentIds = null;

        if (eventId) {
            // Fetch students matching specific event
            if (!company.events.includes(eventId)) {
                return res.status(403).json({ message: 'Event not found or unauthorized' });
            }
            const event = await Event.findById(eventId);
            appliedStudentIds = event ? event.appliedStudents : [];
        } else {
            // Aggregate all students that have applied to ANY event managed by this company
            const allEvents = await Event.find({ _id: { $in: company.events } });
            appliedStudentIds = allEvents.reduce((acc, curr) => {
                return acc.concat(curr.appliedStudents || []);
            }, []);
            // Dedup array
            appliedStudentIds = [...new Set(appliedStudentIds)];
        }

        const query = {};

        // appliedStudents stores email strings — match on email field
        if (appliedStudentIds.length === 0) {
            return res.status(200).json({ students: [] });
        }
        query.email = { $in: appliedStudentIds };

        if (cgpa) {
            query.cgpa = { $gte: parseFloat(cgpa) };
        }

        if (branch) {
            // Student schema field is `department` (not `branch`)
            const branchArray = branch.split(',').map(b => b.trim()).filter(Boolean);
            if (branchArray.length > 0) {
                query.department = { $in: branchArray };
            }
        }

        if (program) {
            // Expecting a comma-separated list of programs
            const programArray = program.split(',').map(p => p.trim());
            if (programArray.length > 0) {
                query.program = { $in: programArray };
            }
        }

        const students = await Student.find(query).select('-__v');
        res.status(200).json({ students });
    } catch (err) {
        console.error('getStudents Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.submitVerification = async (req, res) => {
    try {
        const companyId = req.user.userId;
        const { companyName, companyEmail, companyWebsite, HRContactName, HRContactEmail, contactNumber } = req.body;

        const updateData = {
            verificationStatus: 'pending'
        };

        if (companyName) updateData.companyName = companyName;
        if (companyEmail) updateData.companyEmail = companyEmail;
        if (companyWebsite) updateData.companyWebsite = companyWebsite;
        if (HRContactName) updateData.HRContactName = HRContactName;
        if (HRContactEmail) updateData.HRContactEmail = HRContactEmail;
        if (contactNumber) updateData.contactNumber = contactNumber;

        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            updateData,
            { returnDocument: 'after' }
        );

        if (!updatedCompany) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        res.status(200).json({
            message: 'Company verification submitted successfully.',
            company: updatedCompany
        });

    } catch (err) {
        console.error('submitVerification Error:', err);
        res.status(500).json({ message: 'Internal server error during company verification submission.' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const companyId = req.user.userId;

        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({ message: 'Company not found.' });
        }

        // Gatekeeper
        if (company.verificationStatus !== 'verified') {
            return res.status(403).json({ message: 'Profile editing is restricted until verification is complete.' });
        }

        // Destructure ONLY allowed editable fields (Field-Level Immutability)
        const { companyWebsite, HRContactName, HRContactEmail, contactNumber } = req.body;

        const updateData = {};
        if (companyWebsite !== undefined) updateData.companyWebsite = companyWebsite;
        if (HRContactName !== undefined) updateData.HRContactName = HRContactName;
        if (HRContactEmail !== undefined) updateData.HRContactEmail = HRContactEmail;
        if (contactNumber !== undefined) updateData.contactNumber = contactNumber;

        if (req.file && req.file.path) {
            const { uploadOnCloudinary } = require('../utils/cloudinaryConfig');
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

            if (cloudinaryResponse) {
                updateData.profilePicture = cloudinaryResponse.url;
            } else {
                return res.status(500).json({ message: 'Error uploading profile picture to Cloudinary.' });
            }
        }

        const updatedCompany = await Company.findByIdAndUpdate(
            companyId,
            updateData,
            { returnDocument: 'after', runValidators: true }
        );

        res.status(200).json({
            message: 'Company profile updated successfully.',
            company: updatedCompany
        });
    } catch (err) {
        console.error('updateProfile Error:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.getCompanyEvents = async (req, res) => {
    const Event = require('../models/Event');
    try {
        const companyId = req.user.userId;
        const page = parseInt(req.query.page, 10) || 0;
        const PAGE_SIZE = 6;

        const query = {
            $or: [
                { createdBy: companyId },
                { companyRef: companyId }
            ]
        };

        const total = await Event.countDocuments(query);
        const events = await Event.find(query)
            .sort({ createdAt: -1 })
            .skip(page * PAGE_SIZE)
            .limit(PAGE_SIZE);

        res.status(200).json({
            events,
            total,
            page,
            totalPages: Math.ceil(total / PAGE_SIZE),
        });
    } catch (err) {
        console.error('getCompanyEvents Error:', err);
        res.status(500).json({ message: 'Internal server error while fetching events' });
    }
};

exports.requestEvent = async (req, res) => {
    const Event = require('../models/Event');
    try {
        const { title, description, type, targetPrograms, targetBranches, targetYears, links, rounds } = req.body;
        const companyId = req.user.userId;

        const newEvent = await Event.create({
            title,
            description,
            type,
            targetPrograms: targetPrograms || [],
            targetBranches: targetBranches || [],
            targetYears: targetYears || [],
            links: links || [],
            rounds: rounds || [],
            createdBy: companyId,
            companyRef: companyId,
            status: 'pending_announcement_admin'
        });

        // Add to company events
        const company = await Company.findById(companyId);
        if (company) {
            company.events.push(newEvent._id);
            await company.save();
        }

        res.status(201).json({ message: 'Event request submitted successfully', event: newEvent });
    } catch (err) {
        console.error('requestEvent Error:', err);
        res.status(500).json({ message: 'Internal server error while requesting event' });
    }
};

exports.eventAction = async (req, res) => {
    const Event = require('../models/Event');
    try {
        const { id } = req.params;
        const { action, companyFeedback } = req.body; // action: 'approve', 'request_change', 'cancel'
        const companyId = req.user.userId;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.companyRef.toString() !== companyId) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        if (event.status !== 'pending_company_approval') {
            return res.status(400).json({ message: 'Event is not pending your approval' });
        }

        if (action === 'approve') {
            event.status = 'published';
            event.companyFeedback = ''; // clear feedback
        } else if (action === 'request_change') {
            if (!companyFeedback) {
                return res.status(400).json({ message: 'Feedback is required when requesting a change' });
            }
            event.status = 'pending_announcement_admin';
            event.companyFeedback = companyFeedback;
        } else if (action === 'cancel') {
            event.status = 'cancelled';
            event.companyFeedback = companyFeedback || '';
        }

        await event.save();
        res.status(200).json({ message: `Event ${action}ed successfully`, event });
    } catch (err) {
        console.error('eventAction Error:', err);
        res.status(500).json({ message: 'Internal server error while performing action' });
    }
};

exports.deleteCompanyEvent = async (req, res) => {
    const Event = require('../models/Event');
    const Application = require('../models/Application');
    const Notification = require('../models/Notification');
    try {
        const { id } = req.params;
        const companyId = req.user.userId;

        const event = await Event.findById(id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        // Ensure the company owns the event (safely check both fields)
        const isOwner = (event.companyRef && event.companyRef.toString() === companyId) || 
                        (event.createdBy && event.createdBy.toString() === companyId);

        if (!isOwner) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // 1. Remove from company's events list
        await Company.findByIdAndUpdate(companyId, { $pull: { events: id } });

        // 2. Delete associated Applications and Notifications
        await Application.deleteMany({ eventId: id });
        await Notification.deleteMany({ eventId: id });

        // 3. Delete the event itself
        await Event.findByIdAndDelete(id);

        res.status(200).json({ message: 'Event and associated data deleted successfully' });
    } catch (err) {
        console.error('deleteCompanyEvent Error:', err);
        res.status(500).json({ message: 'Internal server error while deleting event' });
    }
};
