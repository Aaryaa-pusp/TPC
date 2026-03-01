import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { Github, Linkedin, Sparkles } from 'lucide-react';
import axios from 'axios';

// Framer Motion Variants for Staggered Entrance
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 250,
            damping: 20
        }
    }
};

const DeveloperCard = ({ member, index }) => {
    // Explicit organic staggered offsets as requested
    // Card 0: 0px, Card 1: 40px, Card 2: -20px 
    const getOffset = (idx) => {
        const mod = idx % 3;
        if (mod === 0) return 'lg:translate-y-0';
        if (mod === 1) return 'lg:translate-y-[40px]';
        if (mod === 2) return 'lg:-translate-y-[20px]';
        return '';
    };

    const organicOffset = getOffset(index);

    // Spotlight mouse tracking effect
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    return (
        <motion.div variants={itemVariants} className={`h-full w-full ${organicOffset}`}>
            <Tilt
                tiltMaxAngleX={10}
                tiltMaxAngleY={10}
                perspective={1000}
                scale={1.05}
                transitionSpeed={1500}
                gyroscope={true}
                glareEnable={true}
                glareMaxOpacity={0.15}
                glareColor="#ffffff"
                glarePosition="bottom"
                className="h-full rounded-[2rem]"
            >
                <div
                    onMouseMove={handleMouseMove}
                    className="relative h-full flex flex-col items-center px-6 py-10 rounded-[2rem] bg-[#0D0D0D] border border-gray-800 hover:border-cyan-500 transition-colors duration-500 group overflow-hidden"
                >
                    {/* Spotlight Glow Tracking (Interactive Mouse Effect) */}
                    <div
                        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-300 z-0"
                        style={{
                            background: `radial-gradient(600px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(6, 182, 212, 0.1), transparent 40%)`
                        }}
                    />

                    {/* Intense Glow Ignition State (Hover) */}
                    <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
                        style={{ boxShadow: '0 0 25px rgba(6, 182, 212, 0.7)' }}
                    />

                    {/* Subtly animated Shikhar Legend Badge inside the dark card */}
                    {member.name.includes("Shikhar") && (
                        <div className="absolute top-5 right-5 z-20">
                            <div className="relative p-[1.5px] rounded-full overflow-hidden flex">
                                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(0,0,0,0.1)_360deg)] animate-[spin_3s_linear_infinite]"
                                    style={{ backgroundImage: 'conic-gradient(from 0deg, #fcd34d, #f59e0b, #fbbf24, #fcd34d)' }}
                                />
                                <div className="bg-[#1a1a1a] px-3 py-1 rounded-full flex items-center gap-1.5 relative z-10">
                                    <Sparkles size={14} className="text-yellow-400 animate-pulse" />
                                    <span className="text-xs font-serif font-bold text-yellow-500 tracking-wide">Legend</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Image */}
                    <div className="relative w-32 h-32 mb-6 z-10">
                        <div className="absolute inset-0 rounded-full border border-cyan-400 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out z-0" />
                        <img
                            src={member.image}
                            alt={member.name}
                            className="w-full h-full rounded-full object-cover shadow-inner relative z-10 bg-slate-800"
                        />
                    </div>

                    {/* Typography - Silver/White and Muted Grey */}
                    <div className="text-center z-10 relative mb-8 flex-grow">
                        <h3 className="text-2xl font-bold font-sans text-gray-100 tracking-tight mb-1">
                            {member.name}
                        </h3>
                        <p className="text-sm font-medium text-gray-400 mb-3">
                            {member.role}
                        </p>
                        <span className="text-xs text-cyan-300 font-medium bg-cyan-950/40 border border-cyan-900/50 px-3 py-1.5 rounded-full inline-block">
                            {member.specialTag}
                        </span>
                    </div>

                    {/* Floating Social Slide-Up on Hover */}
                    <div className="absolute bottom-6 flex gap-4 opacity-0 translate-y-8 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out z-20">
                        <a
                            href={member.githubUrl}
                            className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-black hover:border-gray-500 hover:-translate-y-1 shadow-lg transition-all"
                        >
                            <Github size={18} />
                        </a>
                        <a
                            href={member.linkedinUrl}
                            className="w-10 h-10 rounded-full bg-[#1A1A1A] border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:-translate-y-1 shadow-lg transition-all"
                        >
                            <Linkedin size={18} />
                        </a>
                    </div>

                </div>
            </Tilt>
        </motion.div>
    );
};

export default function DevelopersPage() {
    const [developers, setDevelopers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDevelopers = async () => {
            try {
                const response = await axios.get('/api/developers');
                setDevelopers(response.data);
            } catch (error) {
                console.error('Failed to fetch developers:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDevelopers();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-cyan-500 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFFFF] font-sans pb-32 pt-32 overflow-hidden relative">

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header Setup */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-32"
                >
                    <div className="inline-block px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-600 font-bold tracking-widest uppercase text-xs mb-8">
                        The Core Team
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif text-gray-900 tracking-tight mb-6">
                        Meet the Developers
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                        The engineering minds and designers forging the premier digital recruitment platform for the Indian Institute of Technology Patna.
                    </p>
                </motion.div>

                {/* Asymmetrical Staggered Onyx Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 lg:gap-y-12"
                >
                    {developers.map((member, index) => (
                        <DeveloperCard key={member._id || member.name} member={member} index={index} />
                    ))}
                </motion.div>

            </div>
        </div>
    );
}
