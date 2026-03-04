const Event = require('../models/Event');
const Student = require('../models/Student');
const Announcement = require('../models/Announcement');

exports.getEvents = async (req, res) => {
    try {
        const { type, targetBranch } = req.query;

        const query = {};
        if (type) query.type = type;

        const targetBranchesRegex = [];
        if (targetBranch && targetBranch.trim() && targetBranch.trim().toLowerCase() !== 'undefined') {
            targetBranchesRegex.push(new RegExp(`^${targetBranch.trim()}$`, 'i'));
        }
        // Always allow matching 'All'
        targetBranchesRegex.push(/^all$/i);
        query.targetBranches = { $in: targetBranchesRegex };

        const events = await Event.find(query).sort({ date: 1 });
        res.status(200).json({ events });
    } catch (err) {
        console.error('getEvents Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAnnouncements = async (req, res) => {
    try {
        const { branch, program } = req.query;

        const andConditions = [];

        // 1. Filter by branch (targetBranches array), case-insensitive
        //    Always include announcements targeted to 'all' branches
        const branchesRegex = [/^all$/i];
        if (branch && branch.trim() && branch.trim().toLowerCase() !== 'undefined') {
            branchesRegex.push(new RegExp(`^${branch.trim()}$`, 'i'));
        }
        andConditions.push({ targetBranches: { $in: branchesRegex } });

        // 2. Filter by targetAudience (student program → enum mapping), case-insensitive
        //    Map frontend program strings ('B.Tech', 'M.Tech', 'M.Sc') to schema enums
        const programMap = {
            'btech': 'btech', 'b.tech': 'btech', 'b tech': 'btech',
            'mtech': 'mtech', 'm.tech': 'mtech', 'm tech': 'mtech',
            'msc': 'msc', 'm.sc': 'msc', 'm sc': 'msc',
            'phd': 'phd'
        };
        const audienceConditions = [{ targetAudience: 'all' }];
        if (program && program.trim() && program.trim().toLowerCase() !== 'undefined') {
            const mapped = programMap[program.trim().toLowerCase()];
            if (mapped) audienceConditions.push({ targetAudience: mapped });
        }
        andConditions.push({ $or: audienceConditions });

        const query = { $and: andConditions };

        const announcements = await Announcement.find(query).sort({ createdAt: -1 }).limit(20);
        res.status(200).json({ announcements });
    } catch (err) {
        console.error('getAnnouncements Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.submitVerification = async (req, res) => {
    try {
        console.log("---- DEBUG: submitVerification endpoint hit ----");
        const { cgpa, phoneNumber } = req.body;
        console.log("DEBUG: Received body:", req.body);
        console.log("DEBUG: Received file:", req.file ? req.file.path : "No file attached");

        const studentId = req.user.userId; // From verifyToken middleware
        console.log("DEBUG: Student ID from token:", studentId);

        const updateData = {
            verificationStatus: 'pending',
        };

        if (req.body.fullName) updateData.fullName = req.body.fullName;
        if (req.body.rollNumber) updateData.rollNumber = req.body.rollNumber;
        if (cgpa) updateData.cgpa = parseFloat(cgpa);
        if (phoneNumber) updateData.phoneNumber = phoneNumber;

        console.log("DEBUG: Checking for file to upload to Cloudinary...");
        if (req.file && req.file.path) {
            console.log("DEBUG: req.file exists. Calling uploadOnCloudinary...");
            const { uploadOnCloudinary } = require('../utils/cloudinaryConfig');
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

            if (cloudinaryResponse) {
                console.log("DEBUG: Cloudinary upload successful, attaching URL to update data.");
                updateData.idCardUrl = cloudinaryResponse.url;
            } else {
                console.error("DEBUG: uploadOnCloudinary returned null or failed.");
                return res.status(500).json({ message: 'Error uploading image to Cloudinary.' });
            }
        } else {
            console.log("DEBUG: No file provided under req.file");
        }

        console.log("DEBUG: Executing findByIdAndUpdate for student:", studentId);
        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            updateData,
            { new: true }
        );

        if (!updatedStudent) {
            console.warn("DEBUG: Student not found in DB");
            return res.status(404).json({ message: 'Student not found.' });
        }

        console.log("DEBUG: Verification updated successfully in DB.");
        res.status(200).json({
            message: 'Verification form submitted successfully.',
            student: updatedStudent
        });

    } catch (err) {
        console.error('---- DEBUG: submitVerification Error ----');
        console.error(err);
        res.status(500).json({ message: 'Internal server error during verification submission.' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const studentId = req.user.userId;

        // Fetch student to check verification status
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: 'Student not found.' });
        }

        // Gatekeeper: Only verified students can update their profile
        if (student.verificationStatus !== 'verified') {
            return res.status(403).json({ message: 'Profile editing is restricted until verification is complete.' });
        }

        // Destructure ONLY the allowed editable fields (Field-Level Immutability)
        const { phoneNumber } = req.body;

        const updateData = {};
        if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;

        // Handle Resume Upload
        if (req.file && req.file.path) {
            const { uploadOnCloudinary } = require('../utils/cloudinaryConfig');
            const cloudinaryResponse = await uploadOnCloudinary(req.file.path);

            if (cloudinaryResponse) {
                updateData.resumeLink = cloudinaryResponse.url;
            } else {
                return res.status(500).json({ message: 'Error uploading resume to Cloudinary.' });
            }
        } else if (req.body.removeResume === 'true') {
            updateData.resumeLink = ''; // Clear the resume link
        }

        const updatedStudent = await Student.findByIdAndUpdate(
            studentId,
            updateData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            message: 'Profile updated successfully.',
            student: updatedStudent
        });
    } catch (err) {
        console.error('updateProfile Error:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
