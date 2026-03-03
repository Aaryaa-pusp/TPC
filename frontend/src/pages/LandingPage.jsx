import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';
import HomePageCharts from '../components/HomePageCharts';
import logo from '../assets/logo.png';
import DevelopersRibbon from '../components/DevelopersRibbon';

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
                            <div className="w-14 h-14 bg-white rounded-xl p-1.5 flex items-center justify-center shadow-sm ring-1 ring-blue-100">
                                <img src={logo} alt="IIT Patna logo" className="w-full h-full object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-gray-900 tracking-tight">Training & Placement</span>
                                <span className="text-sm font-medium text-blue-600">IIT Patna</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</a>
                            <Link to="/developers" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Developers</Link>
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

            {/* Hero Section - Light Mode Editorial */}
            <div className="relative pt-32 pb-32 flex content-center items-center justify-center min-h-[85vh] bg-[#F9FAFB]">
                <div className="absolute top-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-60"></div>
                    <div className="absolute top-40 -left-20 w-72 h-72 bg-emerald-100 rounded-full blur-[80px] opacity-50"></div>
                </div>

                <div className="container relative mx-auto px-4 animate-[fade-in-up_1s_ease-out] z-10">
                    <div className="items-center flex flex-wrap">
                        <div className="w-full lg:w-8/12 mx-auto text-center">
                            <div className="inline-block px-4 py-1.5 rounded-full border border-gray-200 bg-white shadow-sm text-gray-500 font-bold tracking-widest uppercase text-xs mb-8">
                                Excellence in Engineering
                            </div>
                            <h1 className="text-gray-900 font-black text-5xl md:text-7xl leading-[1.1] mb-6 tracking-tight">
                                Where Ambition <br className="hidden md:block" />
                                <span className="text-blue-600 relative inline-block">
                                    Meets Opportunity
                                </span>
                            </h1>
                            <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
                                Empowering the brightest minds at the Indian Institute of Technology Patna
                                to connect with global industry leaders and shape the future of technology.
                            </p>
                            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/login" className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group">
                                    Recruit at IITP
                                    <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </Link>
                                <Link to="/login" className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all duration-300 text-center">
                                    Student Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MESSAGE FROM THE TPC SECTION */}
            <section className="w-screen bg-blue-50/50 py-32 border-y border-blue-100/50 relative left-1/2 right-1/2 -mx-[50vw]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h3 className="text-blue-900 font-bold tracking-widest uppercase text-sm mb-8">
                        Words from the Training & Placement Cell
                    </h3>
                    <div className="font-serif text-xl md:text-2xl text-gray-800 leading-relaxed space-y-8 text-justify md:text-center italic">
                        <p>
                            "The Indian Institute of Technology Patna stands as a beacon of academic rigor and technical prowess. Our curriculum is meticulously designed not just to impart knowledge, but to forge analytical thinkers capable of solving the complex challenges of tomorrow."
                        </p>
                        <p>
                            "We take immense pride in our students, who consistently demonstrate exceptional aptitude and a relentless drive for innovation. The strong, enduring relationships we maintain with global industry leaders are a testament to the unparalleled quality of talent nurtured within these walls."
                        </p>
                        <p className="text-lg text-gray-600 mt-6 font-sans not-italic font-medium">
                            — Professor In-Charge, Training & Placement Cell
                        </p>
                    </div>
                </div>
            </section>
            {/* Statistics Section */}

            <DevelopersRibbon />

            {/* Statistics Section */}
            <section id="stats" className="w-full bg-white relative">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                <HomePageCharts />
            </section>

            {/* Footer */}
            <footer id="contact" className="bg-slate-900 pt-16 pb-8 text-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center shadow-sm ring-1 ring-white/20">
                                    <img src={logo} alt="IIT Patna logo" className="w-full h-full object-contain" />
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
