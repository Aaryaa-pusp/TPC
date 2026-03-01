const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Developer = require('./models/Developer');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/tpc-portal';

const TEAM_MEMBERS = [
    {
        name: "Ravi Kumar",
        role: "Full Stack Engineer",
        specialTag: "System Architecture",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        githubUrl: "https://github.com/ravi-kumar0025",
        linkedinUrl: "https://linkedin.com/in/ravikumar",
        isPublic: true
    },
    {
        name: "Parth",
        role: "Frontend Architect",
        specialTag: "React & Tailwind",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        githubUrl: "https://github.com/parth",
        linkedinUrl: "https://linkedin.com/in/parth",
        isPublic: true
    },
    {
        name: "Aaryaa Push",
        role: "Backend Specialist",
        specialTag: "Node.js & MongoDB",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
        githubUrl: "https://github.com/Aaryaa-pusp",
        linkedinUrl: "https://linkedin.com/in/aarya",
        isPublic: true
    },
    {
        name: "Shikhar Yadav",
        role: "Chief Vibe Officer",
        specialTag: "Team Morale",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop",
        githubUrl: "https://github.com/hind-shikhar",
        linkedinUrl: "https://linkedin.com/in/shikhar",
        isPublic: true
    },
    {
        name: "Devansh Kumar Sharma",
        role: "DevOps Engineer",
        specialTag: "AWS & Docker",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop",
        githubUrl: "https://github.com/DevanshThe888",
        linkedinUrl: "https://linkedin.com/in/deva",
        isPublic: true
    },
    {
        name: "Anjney Lawaniya",
        role: "Product Designer",
        specialTag: "UI/UX & Ideation",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        githubUrl: "https://github.com/Anjney-Lawaniya",
        linkedinUrl: "https://linkedin.com/in/anjney",
        isPublic: true
    }
];

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to DB');
        await Developer.deleteMany({});
        console.log('Cleared existing developers');
        await Developer.insertMany(TEAM_MEMBERS);
        console.log('Successfully seeded 6 Core Team Developers with updated GitHub handles');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        mongoose.disconnect();
    });
