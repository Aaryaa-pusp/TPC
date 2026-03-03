import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Search, Filter, AlertTriangle, Download,
    ChevronRight, GraduationCap, Calendar as CalendarIcon, Tag,
    ArrowLeft, User, Mail, Hash, Phone, Building2, Award,
    FileText, ExternalLink, Star
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EVENT_TYPE_COLORS = {
    internship: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    placement_drive: 'bg-violet-100 text-violet-700 border-violet-200',
    workshop: 'bg-blue-100 text-blue-700 border-blue-200',
};

const PROGRAM_COLORS = {
    'B.Tech': 'bg-blue-100 text-blue-800 border-blue-200',
    'M.Tech': 'bg-violet-100 text-violet-800 border-violet-200',
    'M.Sc': 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

const STATUS_COLORS = {
    verified: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    rejected: 'text-red-600 bg-red-50 border-red-200',
    unsubmitted: 'text-slate-500 bg-slate-50 border-slate-200',
};

// ─── Inline Student Profile ──────────────────────────────────────────
function StudentProfile({ student, onBack }) {
    const cgpaColor = student.cgpa >= 8.5
        ? 'text-emerald-600'
        : student.cgpa >= 7.0
            ? 'text-blue-600'
            : 'text-slate-700';

    return (
        <div className="space-y-6 animate-[fade-in-up_0.3s_ease-out]">
            {/* Back button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-100"
            >
                <ArrowLeft size={18} /> Back to Applicants List
            </button>

            {/* Profile card */}
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden">
                <div className="px-8 pb-8 pt-8">
                    {/* Avatar + name */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                        <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-blue-600 shrink-0">
                            <User size={44} strokeWidth={1.5} />
                        </div>
                        <div className="pb-1">
                            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                                {student.fullName || student.name || '—'}
                            </h2>
                            <div className="flex items-center gap-2 flex-wrap mt-1">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${PROGRAM_COLORS[student.program] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                    {student.program}
                                </span>
                                <span className="text-sm text-slate-500 font-medium">
                                    {student.department || student.branch || ''}
                                </span>
                                {student.institute && (
                                    <span className="text-sm text-slate-400">· {student.institute}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* CGPA highlight */}
                        <div className="lg:col-span-1 flex flex-col gap-4">
                            <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                                <Star size={22} className="text-yellow-400 fill-yellow-400 shrink-0" />
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-0.5">CGPA</p>
                                    <p className={`text-3xl font-extrabold ${cgpaColor}`}>
                                        {student.cgpa != null ? Number(student.cgpa).toFixed(2) : 'N/A'}
                                        <span className="text-sm font-semibold text-slate-400 ml-1">/ 10</span>
                                    </p>
                                </div>
                            </div>

                            {student.verificationStatus && (
                                <div className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Verification</p>
                                    <span className={`text-sm font-bold px-3 py-1 rounded-full border capitalize ${STATUS_COLORS[student.verificationStatus] || ''}`}>
                                        {student.verificationStatus}
                                    </span>
                                </div>
                            )}

                            {/* Resume */}
                            <div>
                                {student.resumeLink ? (
                                    <a
                                        href={student.resumeLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow shadow-blue-500/25"
                                    >
                                        <FileText size={18} />
                                        View Resume
                                        <ExternalLink size={14} className="opacity-70" />
                                    </a>
                                ) : (
                                    <div className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-400 font-semibold py-3 rounded-xl border border-slate-200 cursor-not-allowed select-none">
                                        <FileText size={18} />
                                        No Resume Uploaded
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-2 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 space-y-4">
                            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider border-b border-slate-200 pb-3">
                                Personal Information
                            </h3>
                            <InfoRow icon={<Mail size={16} />} label="Email" value={student.email} />
                            <InfoRow icon={<Hash size={16} />} label="Roll Number" value={student.rollNumber} mono />
                            <InfoRow icon={<GraduationCap size={16} />} label="Program" value={student.program} />
                            <InfoRow icon={<Building2 size={16} />} label="Department" value={student.department || student.branch} />
                            <InfoRow icon={<CalendarIcon size={16} />} label="Grad. Year" value={student.graduationYear} />
                            <InfoRow icon={<Building2 size={16} />} label="Institute" value={student.institute || 'IIT Patna'} />
                            {student.phoneNumber && (
                                <InfoRow icon={<Phone size={16} />} label="Phone" value={student.phoneNumber} />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value, mono = false }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-slate-400 shrink-0">{icon}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 w-28 shrink-0">{label}</span>
            <span className={`text-sm text-slate-800 font-medium truncate ${mono ? 'font-mono tracking-wide' : ''}`}>
                {value || '—'}
            </span>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────
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
    const [selectedEventId, setSelectedEventId] = useState('');

    // Inline profile view
    const [selectedStudent, setSelectedStudent] = useState(null);

    const branchOptions = ['CSE', 'EE', 'ME', 'CE', 'CBE'];
    const programOptions = ['B.Tech', 'M.Tech', 'M.Sc'];

    useEffect(() => {
        if (user?.verificationStatus === 'verified') fetchCompanyEvents();
    }, [user?.verificationStatus]);

    useEffect(() => {
        if (user?.verificationStatus === 'verified') fetchStudents();
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

    const exportToPDF = () => {
        if (students.length === 0) return;

        const doc = new jsPDF();

        // Header Setup
        doc.setFillColor(30, 58, 138); // blue-900 baseline
        doc.rect(0, 0, doc.internal.pageSize.width, 35, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('IIT Patna TPC - Applicants Database', 14, 22);

        // Title context based on filter
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        let contextText = 'All Applicants';
        if (selectedEventId) {
            const ev = companyEvents.find(e => e._id === selectedEventId);
            if (ev) contextText = `Event: ${ev.title} (${ev.type.replace('_', ' ')})`;
        }

        const timestamp = new Date().toLocaleString();
        doc.text(contextText, 14, 45);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on: ${timestamp} | Total: ${students.length}`, 14, 52);

        // Map data to AutoTable Format
        const tableColumn = ["Roll No", "Name", "Email", "Program / Branch", "CGPA"];
        const tableRows = students.map(student => [
            student.rollNumber || '—',
            student.fullName || student.name || '—',
            student.email,
            `${student.program} - ${student.department || student.branch || ''}`,
            student.cgpa != null ? Number(student.cgpa).toFixed(2) : 'N/A'
        ]);

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 58,
            theme: 'striped',
            headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
            bodyStyles: { textColor: 50 },
            alternateRowStyles: { fillColor: [248, 250, 252] },
        });

        doc.save(`Applicants_List_${new Date().getTime()}.pdf`);
    };

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

    // ── If a student is selected, show inline profile ──
    if (selectedStudent) {
        return (
            <StudentProfile
                student={selectedStudent}
                onBack={() => setSelectedStudent(null)}
            />
        );
    }

    // ── Default: show applicants list ──
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
                <button
                    onClick={exportToPDF}
                    disabled={students.length === 0 || loading || eventsLoading}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 ${students.length === 0 || loading || eventsLoading
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                        }`}
                >
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
                                    No events posted yet.
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

                        {/* Program */}
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

                        {/* Branch */}
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
                                {selectedEventId ? 'No applicants found for this event.' : 'No applicants yet across your events.'}
                            </p>
                            <p className="text-sm text-slate-400">Students appear here once they apply to your posted events.</p>
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
                                                <button
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="hover:text-blue-900 hover:underline transition-colors"
                                                >
                                                    View Profile
                                                </button>
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
