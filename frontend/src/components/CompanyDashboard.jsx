import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Search, Filter, AlertTriangle, Download,
    ChevronRight, GraduationCap, Calendar as CalendarIcon, Tag
} from 'lucide-react';

const EVENT_TYPE_COLORS = {
    internship: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    placement_drive: 'bg-violet-100 text-violet-700 border-violet-200',
    workshop: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function CompanyDashboard() {
    const { user, token } = useAuth();
    const [students, setStudents] = useState([]);
    const [companyEvents, setCompanyEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eventsLoading, setEventsLoading] = useState(true);

    // Filters
    const [cgpa, setCgpa] = useState('');
    const [branch, setBranch] = useState([]);
    const [program, setProgram] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState(''); // '' = all events combined

    const branchOptions = ['CSE', 'EE', 'ME', 'CE', 'CBE'];
    const programOptions = ['B.Tech', 'M.Tech', 'M.Sc'];

    // Fetch company's own events once on mount
    useEffect(() => {
        if (user?.verificationStatus === 'verified') {
            fetchCompanyEvents();
        }
    }, [user?.verificationStatus]);

    // Re-fetch students whenever any filter changes
    useEffect(() => {
        if (user?.verificationStatus === 'verified') {
            fetchStudents();
        }
    }, [cgpa, branch, program, selectedEventId]);

    const fetchCompanyEvents = async () => {
        setEventsLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5000/api/company/events', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCompanyEvents(data.events || []);
        } catch (err) {
            console.error('Failed to fetch company events', err);
        } finally {
            setEventsLoading(false);
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5000/api/company/students', {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    cgpa: cgpa || undefined,
                    branch: branch.length ? branch.join(',') : undefined,
                    program: program.length ? program.join(',') : undefined,
                    eventId: selectedEventId || undefined,
                },
            });
            setStudents(data.students || []);
        } catch (err) {
            console.error('Failed to fetch students', err);
        } finally {
            setLoading(false);
        }
    };

    const toggleFilter = (setter, state, value) => {
        setter(state.includes(value) ? state.filter(i => i !== value) : [...state, value]);
    };

    const clearAll = () => { setCgpa(''); setBranch([]); setProgram([]); setSelectedEventId(''); };

    const hasFilters = cgpa || branch.length || program.length || selectedEventId;

    if (user?.verificationStatus === 'pending' || user?.verificationStatus === 'unsubmitted') {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto animate-[fade-in-up_0.5s_ease-out]">
                <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-yellow-100">
                    <AlertTriangle size={36} strokeWidth={1.5} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Account Under Review</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Your company profile is currently being verified by the IIT Patna TPC Administration.
                    Access to applicant data will be granted once verified (usually within 48 hours).
                </p>
                <button className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-1 transition-colors bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                    Contact Support <ChevronRight size={16} />
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-[fade-in-up_0.5s_ease-out]">

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <GraduationCap className="text-blue-600" size={28} />
                        Applicants Database
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">
                        Review candidates who applied to your events &mdash;&nbsp;
                        <span className="font-semibold text-slate-700">{students.length} found</span>
                    </p>
                </div>
                <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition shadow-md shadow-blue-500/20">
                    <Download size={18} /> Export List
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* ── Filters Sidebar ── */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 h-fit lg:sticky lg:top-24">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                        <Filter size={20} className="text-blue-500" /> Advanced Filters
                    </h3>

                    <div className="space-y-6">

                        {/* Event selector */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                                <CalendarIcon size={13} /> Event
                            </label>
                            {eventsLoading ? (
                                <div className="h-9 bg-slate-100 rounded-xl animate-pulse" />
                            ) : companyEvents.length === 0 ? (
                                <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    No events posted yet. Create one via the admin calendar.
                                </p>
                            ) : (
                                <select
                                    value={selectedEventId}
                                    onChange={e => setSelectedEventId(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
                                >
                                    <option value="">All my events (combined)</option>
                                    {companyEvents.map(ev => (
                                        <option key={ev._id} value={ev._id}>
                                            {ev.title}&nbsp;·&nbsp;{ev.type?.replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            )}

                            {/* Selected event chip */}
                            {selectedEventId && (() => {
                                const ev = companyEvents.find(e => e._id === selectedEventId);
                                return ev ? (
                                    <div className={`mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border ${EVENT_TYPE_COLORS[ev.type] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                        <Tag size={11} /> {ev.title}
                                    </div>
                                ) : null;
                            })()}
                        </div>

                        {/* CGPA slider */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">
                                Min CGPA: <span className="text-blue-600">{cgpa || 'Any'}</span>
                            </label>
                            <input
                                type="range" min="0" max="10" step="0.5"
                                value={cgpa}
                                onChange={e => setCgpa(e.target.value)}
                                className="w-full accent-blue-600 bg-slate-200 rounded-lg appearance-none cursor-pointer h-2"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                                <span>0</span><span>5</span><span>10</span>
                            </div>
                        </div>

                        {/* Program checkboxes */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Program</label>
                            <div className="space-y-2">
                                {programOptions.map(prog => (
                                    <label key={prog} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            checked={program.includes(prog)}
                                            onChange={() => toggleFilter(setProgram, program, prog)}
                                        />
                                        <span className="text-sm text-slate-600 group-hover:text-slate-900 font-medium">{prog}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Branch checkboxes */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 mb-3 uppercase tracking-wider">Branch</label>
                            <div className="space-y-2">
                                {branchOptions.map(b => (
                                    <label key={b} className="flex items-center gap-3 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            checked={branch.includes(b)}
                                            onChange={() => toggleFilter(setBranch, branch, b)}
                                        />
                                        <span className="text-sm text-slate-600 group-hover:text-slate-900 font-medium">{b}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {hasFilters && (
                            <button
                                onClick={clearAll}
                                className="w-full py-2 text-sm text-red-600 font-semibold bg-red-50 hover:bg-red-100 rounded-xl border border-red-100 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                </div>

                {/* ── Results Table ── */}
                <div className="lg:col-span-3 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-slate-400 animate-pulse font-medium">Loading applicants…</div>
                    ) : students.length === 0 ? (
                        <div className="p-16 text-center text-slate-500 flex flex-col items-center gap-3">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                                <Search size={28} className="text-slate-300" />
                            </div>
                            <p className="text-lg font-semibold text-slate-700">
                                {selectedEventId
                                    ? 'No applicants found for this event.'
                                    : 'No applicants yet across your events.'}
                            </p>
                            <p className="text-sm text-slate-400">
                                Students appear here once they apply to your posted events.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50/80">
                                    <tr>
                                        {['Candidate', 'Roll No', 'Program / Branch', 'CGPA', 'Action'].map(h => (
                                            <th key={h} scope="col" className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {students.map(student => (
                                        <tr key={student._id} className="hover:bg-blue-50/50 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                                    {student.fullName || student.name || '—'}
                                                </div>
                                                <div className="text-xs text-slate-500">{student.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono tracking-wide">
                                                {student.rollNumber || '—'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-blue-100 text-blue-800 mr-2 border border-blue-200">
                                                    {student.program}
                                                </span>
                                                <span className="text-sm text-slate-600 font-medium">
                                                    {student.department || student.branch || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`text-sm font-bold ${student.cgpa >= 8.5 ? 'text-emerald-600' : 'text-slate-700'}`}>
                                                    {student.cgpa != null ? Number(student.cgpa).toFixed(2) : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-bold">
                                                <button className="hover:text-blue-900 group-hover:underline">View Profile</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
