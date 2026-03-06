require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Announcement = require('./models/Announcement');
const Event = require('./models/Event');
const Admin = require('./models/Admin');

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        // Drop bad indexes to fix the 'parallel arrays' error
        try {
            await Event.collection.dropIndexes();
            console.log("Dropped old Event indexes");
        } catch (e) {
            console.log("Could not drop Event indexes (maybe none exist):", e.message);
        }
        try {
            await Announcement.collection.dropIndexes();
            console.log("Dropped old Announcement indexes");
        } catch (e) {
            console.log("Could not drop Announcement indexes:", e.message);
        }

        // Re-sync correct indexes
        await Event.syncIndexes();
        await Announcement.syncIndexes();
        console.log("Synced correct indexes");

        // Find stud@gmail.com
        const student = await Student.findOne({ email: 'stud@gmail.com' });
        if (!student) {
            console.log("Could not find stud@gmail.com. Please register or specify an existing email.");
            process.exit(1);
        }

        // Update student profile to guarantee targeting checks
        student.program = 'B.Tech';
        student.department = 'CSE';
        student.currentYearOfStudy = '3rd Year';
        await student.save();
        console.log("Updated stud@gmail.com to B.Tech, CSE, 3rd Year");

        const admin = await Admin.findOne();
        const adminId = admin ? admin._id : null;

        await Announcement.create({
            title: '[Dummy] Targeted Announcement (B.Tech, CSE, 3rd Year)',
            content: 'You should see this announcement because your profile matches.',
            targetPrograms: ['B.Tech'],
            targetBranches: ['CSE'],
            targetYears: ['3rd Year'],
            createdBy: adminId
        });

        await Announcement.create({
            title: '[Dummy] Hidden Announcement (M.Tech Only)',
            content: 'You should NOT see this announcement.',
            targetPrograms: ['M.Tech'],
            targetBranches: ['All'],
            targetYears: [],
            createdBy: adminId
        });

        await Announcement.create({
            title: '[Dummy] Global Announcement (All Students)',
            content: 'Everyone should see this announcement.',
            targetPrograms: [],
            targetBranches: ['All'],
            targetYears: [],
            createdBy: adminId
        });

        console.log("Created Announcements");

        await Event.create({
            title: '[Dummy] Targeted Event (B.Tech, CSE, 3rd Year)',
            type: 'placement_drive',
            description: 'You should see this event.',
            startDate: new Date(),
            deadline: new Date(Date.now() + 86400000 * 5),
            targetPrograms: ['B.Tech'],
            targetBranches: ['CSE'],
            targetYears: ['3rd Year'],
            createdBy: adminId,
        });

        await Event.create({
            title: '[Dummy] Hidden Event (M.Tech Only)',
            type: 'internship',
            description: 'You should NOT see this event.',
            startDate: new Date(),
            deadline: new Date(Date.now() + 86400000 * 5),
            targetPrograms: ['M.Tech'],
            targetBranches: ['All'],
            targetYears: [],
            createdBy: adminId,
        });

        await Event.create({
            title: '[Dummy] Global Event (All Students)',
            type: 'workshop',
            description: 'Everyone should see this event.',
            startDate: new Date(),
            deadline: new Date(Date.now() + 86400000 * 5),
            targetPrograms: [],
            targetBranches: ['All'],
            targetYears: [],
            createdBy: adminId,
        });

        console.log("Created Events");
        console.log("Dummy data injected successfully.");

    } catch (err) {
        console.error("Error inserting dummy data:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

start();
