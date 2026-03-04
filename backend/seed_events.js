/**
 * Seed script for test events.
 * 
 * Run: node seed_events.js
 * 
 * Requires MONGODB_URI in .env or defaults to mongodb://127.0.0.1:27017/tpc-portal
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Event = require('./models/Event');
const User = require('./models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tpc-portal';

// Helper: offset days from a base date
function daysFromNow(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    d.setHours(10, 0, 0, 0);
    return d;
}

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find any admin user to use as createdBy, or create a dummy ObjectId
        let adminUser = await User.findOne({ role: 'admin' });
        const createdBy = adminUser ? adminUser._id : new mongoose.Types.ObjectId();

        // Clear existing events (optional — comment out if you want to keep existing)
        await Event.deleteMany({});
        console.log('Cleared existing events');

        const testEvents = [
            // ══════ PAST EVENTS (grey) ══════
            {
                title: 'Google Summer Internship 2025',
                description: 'Google Summer of Code style internship opportunity for 2nd & 3rd year students. Stipend: ₹80,000/month.',
                startDate: daysFromNow(-45),
                endDate: daysFromNow(-40),
                type: 'internship',
                targetBranches: ['CSE', 'ECE', 'all'],
                deadline: daysFromNow(-41),
                appliedStudents: ['stud@gmail.com', 'alice@iitpatna.ac.in'],
                links: [{ label: 'Google Careers', url: 'https://careers.google.com' }],
                createdBy,
            },
            {
                title: 'Amazon SDE Placement Drive',
                description: 'On-campus placement drive for Amazon SDE-1 roles. Package: 28-44 LPA. Multiple rounds including coding, system design, and behavioral.',
                startDate: daysFromNow(-30),
                endDate: daysFromNow(-28),
                type: 'placement_drive',
                targetBranches: ['CSE', 'IT', 'ECE'],
                deadline: daysFromNow(-29),
                appliedStudents: ['stud@gmail.com'],
                links: [{ label: 'Amazon Jobs', url: 'https://amazon.jobs' }],
                createdBy,
            },
            {
                title: 'Resume Building Workshop',
                description: 'Learn how to craft a compelling resume that stands out to top recruiters. Hosted by the Career Development Cell.',
                startDate: daysFromNow(-20),
                endDate: daysFromNow(-20),
                type: 'workshop',
                targetBranches: ['all'],
                appliedStudents: [],
                links: [],
                createdBy,
            },

            // ══════ ACTIVE EVENTS (dark green — happening now) ══════
            {
                title: 'Microsoft Engage Internship',
                description: 'Microsoft Engage 2026 mentorship program. Build a real-world project with Microsoft mentors over 3 weeks. Open to pre-final year students.',
                startDate: daysFromNow(-3),
                endDate: daysFromNow(4),
                type: 'internship',
                targetBranches: ['CSE', 'ECE', 'EE', 'all'],
                deadline: daysFromNow(2),
                appliedStudents: [],
                links: [
                    { label: 'MS Engage Portal', url: 'https://microsoft.com/engage' },
                    { label: 'Info Brochure', url: 'https://example.com/brochure.pdf' },
                ],
                createdBy,
            },
            {
                title: 'Flipkart GRiD 6.0 Hackathon',
                description: 'National level hackathon by Flipkart. Top 10 teams get pre-placement interviews. Registration closing soon!',
                startDate: daysFromNow(-1),
                endDate: daysFromNow(6),
                type: 'placement_drive',
                targetBranches: ['CSE', 'IT'],
                deadline: daysFromNow(3),
                appliedStudents: ['stud@gmail.com'],
                links: [{ label: 'GRiD Portal', url: 'https://grid.flipkart.com' }],
                createdBy,
            },

            // ══════ UPCOMING EVENTS (blue) ══════
            {
                title: 'Goldman Sachs Engineering Hiring',
                description: 'Goldman Sachs is hiring for Engineering Analyst roles. CTC: 32 LPA. Eligibility: B.Tech CSE/IT with CGPA ≥ 7.5.',
                startDate: daysFromNow(7),
                endDate: daysFromNow(9),
                type: 'placement_drive',
                targetBranches: ['CSE', 'IT'],
                deadline: daysFromNow(6),
                appliedStudents: [],
                links: [{ label: 'GS Careers', url: 'https://goldmansachs.com/careers' }],
                createdBy,
            },
            {
                title: 'Adobe GenSolve Internship',
                description: 'Adobe\'s flagship internship program for creative problem solvers. Work on real Adobe products. Stipend: ₹1,00,000/month.',
                startDate: daysFromNow(14),
                endDate: daysFromNow(16),
                type: 'internship',
                targetBranches: ['CSE', 'ECE', 'ME'],
                deadline: daysFromNow(12),
                appliedStudents: [],
                links: [{ label: 'Apply on Adobe', url: 'https://adobe.com/careers' }],
                createdBy,
            },
            {
                title: 'Data Science with Python Workshop',
                description: 'Hands-on 2-day workshop on data science using Pandas, NumPy, Scikit-learn, and real-world datasets. No prior ML experience needed.',
                startDate: daysFromNow(21),
                endDate: daysFromNow(22),
                type: 'workshop',
                targetBranches: ['all'],
                appliedStudents: [],
                links: [],
                createdBy,
            },
            {
                title: 'Uber HackerTag 2026',
                description: 'Uber\'s annual coding competition. Winners get direct interviews for SDE intern/full-time roles. Cash prizes for top 3.',
                startDate: daysFromNow(30),
                endDate: daysFromNow(32),
                type: 'placement_drive',
                targetBranches: ['CSE', 'IT', 'ECE'],
                deadline: daysFromNow(28),
                appliedStudents: [],
                links: [{ label: 'HackerTag', url: 'https://uber.com/hackertag' }],
                createdBy,
            },
            {
                title: 'Deloitte Consulting Internship',
                description: 'Strategy & Operations consulting internship for MBA and B.Tech final year students. 8-week program at Deloitte offices.',
                startDate: daysFromNow(45),
                endDate: daysFromNow(48),
                type: 'internship',
                targetBranches: ['CSE', 'ME', 'CE', 'all'],
                deadline: daysFromNow(40),
                appliedStudents: [],
                links: [{ label: 'Deloitte Careers', url: 'https://deloitte.com/careers' }],
                createdBy,
            },

            // ══════ ALREADY-APPLIED EVENT (light green for stud@gmail.com) ══════
            {
                title: 'Infosys InStep Internship',
                description: 'Global internship program by Infosys. Work on cutting-edge technology projects with global teams.',
                startDate: daysFromNow(10),
                endDate: daysFromNow(12),
                type: 'internship',
                targetBranches: ['CSE', 'ECE', 'IT', 'all'],
                deadline: daysFromNow(9),
                appliedStudents: ['stud@gmail.com'],
                links: [{ label: 'InStep Portal', url: 'https://infosys.com/instep' }],
                createdBy,
            },
        ];

        const created = await Event.insertMany(testEvents);
        console.log(`✅ Seeded ${created.length} test events successfully!`);
        console.log('\nEvents created:');
        created.forEach(e => {
            console.log(`  • ${e.title} (${e.type}) — ${e.startDate.toLocaleDateString()} to ${e.endDate.toLocaleDateString()}`);
        });

        await mongoose.disconnect();
        console.log('\nDisconnected from MongoDB');
        process.exit(0);
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
}

seed();
