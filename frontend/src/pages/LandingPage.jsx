import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import DevelopersRibbon from '../components/DevelopersRibbon';
import HomePageCharts from '../components/HomePageCharts';

const placementData = [
    { name: 'B.Tech', rate: 94 },
    { name: 'M.Tech', rate: 86 },
    { name: 'M.Sc', rate: 75 },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                IITP
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-gray-900 tracking-tight">Training & Placement</span>
                                <span className="text-sm font-medium text-blue-600">IIT Patna</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</a>
                            <a href="#stats" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Statistics</a>
                            <a href="#contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Contact</a>
                            <Link to="/developers" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Developers</Link>
                            <div className="h-6 w-px bg-gray-200"></div>
                            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">Log in</Link>
                            <Link to="/login" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all">
                                Portal Access
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-20 pb-32 flex content-center items-center justify-center min-h-[90vh]">
                <div className="absolute top-0 w-full h-full bg-slate-900 overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80"
                        alt="IIT Patna Campus"
                        className="w-full h-full object-cover opacity-30 object-center scale-105 animate-[pulse_20s_ease-in-out_infinite]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900"></div>
                </div>

                <div className="container relative mx-auto px-4 mt-16 animate-[fade-in-up_1s_ease-out]">
                    <div className="items-center flex flex-wrap">
                        <div className="w-full lg:w-8/12 mx-auto text-center">
                            <div className="inline-block px-4 py-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-sm text-blue-300 font-medium text-sm mb-6 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                Excellence in Engineering & Technology
                            </div>
                            <h1 className="text-white font-extrabold text-5xl md:text-7xl leading-tight mb-6 tracking-tight drop-shadow-lg">
                                Where Ambition <br className="hidden md:block" />
                                <span className="text-blue-400 relative inline-block">
                                    Meets Opportunity
                                    <span className="absolute bottom-1 left-0 w-full h-3 bg-blue-600/30 -z-10 rounded-full blur-sm"></span>
                                </span>
                            </h1>
                            <p className="mt-4 text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
                                Empowering the brightest minds at Indian Institute of Technology Patna
                                to connect with global industry leaders and shape the future of technology.
                            </p>
                            <div className="mt-10 flex gap-4 justify-center">
                                <Link to="/login" className="bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-400 hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-300 flex items-center gap-2 group">
                                    Recruit at IITP
                                    <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                                <Link to="/login" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300">
                                    Student Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Section */}
            <HomePageCharts />

            <DevelopersRibbon />

            {/* Footer */}
            <footer id="contact" className="bg-slate-900 pt-16 pb-8 text-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-900 font-bold text-lg">
                                    IITP
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">TPC IIT Patna</h3>
                            </div>
                            <p className="mt-4 text-slate-400 font-light leading-relaxed">
                                Bridging the gap between academic brilliance and industry excellence.
                                Creating leaders of tomorrow.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white border-b border-white/10 pb-2 inline-block">Contact</h4>
                            <ul className="space-y-4 text-slate-400 text-sm">
                                <li className="flex items-start gap-3">
                                    <MapPin size={18} className="text-blue-400 mt-1 flex-shrink-0" />
                                    <span>Training and Placement Cell,<br />Admin Block, IIT Patna,<br />Bihta, Bihar - 801103</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Mail size={18} className="text-blue-400" />
                                    <a href="mailto:tpc@iitp.ac.in" className="hover:text-blue-400 transition-colors">tpc@iitp.ac.in</a>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Phone size={18} className="text-blue-400" />
                                    <span>+91-6115-233091</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white border-b border-white/10 pb-2 inline-block">Quick Links</h4>
                            <ul className="space-y-3 text-sm text-slate-400">
                                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><BookOpen size={14} /> Student Guidelines</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><BookOpen size={14} /> Company Brochure</a></li>
                                <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2"><BookOpen size={14} /> Placement Policy</a></li>
                                <li><Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors mt-2 inline-block">Login Portal &rarr;</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-16 pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
                        <p>&copy; {new Date().getFullYear()} Training and Placement Cell, IIT Patna. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
