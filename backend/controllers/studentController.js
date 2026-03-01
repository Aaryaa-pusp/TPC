const Event = require('../models/Event');
const Student = require('../models/Student');

exports.getEvents = async (req, res) => {
    try {
        const { type, targetBranch } = req.query;

        const query = {};
        if (type) query.type = type;
        if (targetBranch) query.targetBranches = targetBranch; // Matches if targetBranch is in the array

        const events = await Event.find(query).sort({ date: 1 });
        res.status(200).json({ events });
    } catch (err) {
        console.error('getEvents Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getAnnouncements = async (req, res) => {
    try {
        const { branch, batch } = req.query;
        // Announcements could be Events of type 'workshop' or special schema. 
        // We will use Event with specific targetBranches.
        const query = {};
        if (branch) {
            query.targetBranches = { $in: [branch, 'All'] };
        }

        // For simplicity, we just return events sorted by createdAt for announcements
        const announcements = await Event.find(query).sort({ createdAt: -1 }).limit(20);
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
