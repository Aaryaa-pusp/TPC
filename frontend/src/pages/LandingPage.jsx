import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { BookOpen, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

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
            <section id="stats" className="py-24 bg-white relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Placement Statistics 2023-24</h2>
                        <p className="mt-4 text-xl text-gray-500 font-light">A testament to our academic excellence and industry relevance</p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 mb-16">
                        <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-blue-600 mb-2">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Highest Package</p>
                            <p className="mt-2 text-4xl font-extrabold text-gray-900 group">
                                82.05 <span className="text-2xl text-gray-400 font-medium">LPA</span>
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl shadow-xl hover:-translate-y-1 transition-transform duration-300 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" /></svg>
                            </div>
                            <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">Average Package</p>
                            <p className="mt-2 text-4xl font-extrabold">
                                23.90 <span className="text-2xl font-medium opacity-80">LPA</span>
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] border border-gray-100 hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-blue-600 mb-2">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                            </div>
                            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Median Package</p>
                            <p className="mt-2 text-4xl font-extrabold text-gray-900">
                                20.00 <span className="text-2xl text-gray-400 font-medium">LPA</span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-8 text-center sm:text-left">Placement Percentage by Program</h3>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                                <BarChart data={placementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value}%`} />
                                    <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="rate" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={60} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </section>

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
