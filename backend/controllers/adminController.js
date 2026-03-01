const Company = require('../models/Company');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Event = require('../models/Event');
const Announcement = require('../models/Announcement');
const Student = require('../models/Student');

exports.getPendingCompanies = async (req, res) => {
    try {
        const companies = await Company.find({ verificationStatus: 'pending' });
        res.status(200).json({ companies });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.verifyCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { status } = req.body; // 'verified' or 'rejected'

        if (!['verified', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const company = await Company.findByIdAndUpdate(
            companyId,
            { verificationStatus: status },
            { new: true }
        );

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        res.status(200).json({ message: `Company marked as ${status}`, company });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.assignAdminPower = async (req, res) => {
    try {
        const { email, newAdminType } = req.body;
        const currentAdminType = req.user.adminType;

        if (currentAdminType !== 'super_admin' && currentAdminType !== newAdminType) {
            return res.status(403).json({ message: 'You can only create admins of your own type' });
        }

        let existingUser = await User.findOne({ email });

        if (existingUser) {
            if (existingUser.role !== 'admin') {
                return res.status(400).json({ message: `Cannot change role of an existing ${existingUser.role} into an admin automatically. Delete the account first or use a new email.` });
            }
            // Update existing admin
            existingUser.adminType = newAdminType;
            await existingUser.save();
            return res.status(200).json({ message: `Successfully updated ${email} to ${newAdminType.replace('_', ' ')}` });
        }

        const bcrypt = require('bcryptjs');
        const otp = '123';
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(otp, salt);

        const newAdmin = await Admin.create({
            email,
            role: 'admin',
            adminType: newAdminType,
            isVerified: true,
            fullName: 'Newly Assigned Admin',
            status: 'active',
            otp: hashedOtp,
            otpExpiry: Date.now() + 10000000
        });

        res.status(201).json({ message: `Successfully granted ${newAdminType.replace('_', ' ')} access to ${email}`, user: newAdmin });
    } catch (err) {
        console.error('Assign Power Error:', err);
        res.status(500).json({ message: 'Internal server error while assigning power' });
    }
};

exports.createEvent = async (req, res) => {
    try {
        // Both super_admin, announcement_admin, student_admin can create events theoretically based on requirements
        const { title, description, date, type, targetBranches, deadline } = req.body;

        const newEvent = await Event.create({
            title,
            description,
            date,
            type,
            targetBranches,
            deadline,
            createdBy: req.user.userId
        });

        res.status(201).json({ message: 'Event created', event: newEvent });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find().sort({ createdAt: -1 }).populate('createdBy', 'fullName email');
        res.status(200).json({ announcements });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createAnnouncement = async (req, res) => {
    try {
        const { title, content, targetAudience, targetBranches } = req.body;
        const newAnnouncement = await Announcement.create({
            title,
            content,
            targetAudience,
            targetBranches,
            createdBy: req.user.userId
        });
        res.status(201).json({ message: 'Announcement created', announcement: newAnnouncement });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.status(200).json({ message: 'Announcement updated', announcement: updatedAnnouncement });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAnnouncement = await Announcement.findByIdAndDelete(id);
        if (!deletedAnnouncement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.status(200).json({ message: 'Announcement deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getPendingStudents = async (req, res) => {
    try {
        const pendingStudents = await Student.find({ verificationStatus: 'pending' }).select('-otp -otpExpiry');
        res.status(200).json({ pendingStudents });
    } catch (err) {
        console.error('getPendingStudents Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.verifyStudentData = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { status } = req.body; // 'verified' or 'rejected'

        if (!['verified', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const student = await Student.findByIdAndUpdate(
            studentId,
            { verificationStatus: status },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.status(200).json({ message: `Student verification marked as ${status}`, student });
    } catch (err) {
        console.error('verifyStudentData Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
