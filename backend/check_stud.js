require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/Student');

const check = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const student = await Student.findOne({ email: 'stud@gmail.com' });

    // Revert back to M.Tech
    student.program = 'M.Tech';
    student.currentYearOfStudy = '2nd Year';
    await student.save();

    console.log("Restored stud profile:", {
        email: student.email,
        program: student.program,
        department: student.department,
        currentYearOfStudy: student.currentYearOfStudy
    });
    process.exit(0);
};

check();
