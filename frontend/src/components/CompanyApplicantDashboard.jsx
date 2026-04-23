import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import {
    ArrowLeft, Search, Filter, ChevronLeft, ChevronRight,
    Check, X, User, Mail, Hash, GraduationCap, Building2,
    FileText, ExternalLink, Star, Clock, AlertTriangle, ChevronRight as ChevRight,
    Loader2,
} from 'lucide-react';

const PAGE_SIZE = 6;
const BRANCH_OPTIONS = ['CSE', 'EE', 'ME', 'CE', 'CBE'];
const YEAR_OPTIONS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

const STATUS_CONFIG = {
    pending:      { label: 'Pending',       cls: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900' },
    accepted:     { label: 'Selected',      cls: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900' },
    rejected:     { label: 'Rejected',      cls: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900' },
    auto_rejected:{ label: 'Expired',       cls: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
};

function RoundBreadcrumbs({ rounds, selected, onSelect }) {
    const steps = rounds.length > 0 ? rounds : [{ title: 'All Applicants' }];
    return (
        <div className="flex items-center gap-1 flex-wrap">
            <button
                onClick={() => onSelect(null)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selected === null ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
            >
                All
            </button>
            {steps.map((round, idx) => (
                <React.Fragment key={idx}>
                    <ChevRight size={14} className="text-slate-300 dark:text-slate-600 shrink-0" />
                    <button
                        onClick={() => onSelect(idx)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selected === idx ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
                    >
                        {round.title}
                        {round.endDate && (
                            <span className="ml-1.5 opacity-60 font-normal">
                                · {new Date(round.endDate) < new Date() ? '⏰ Ended' : `ends ${new Date(round.endDate).toLocaleDateString()}`}
                            </span>
                        )}
                    </button>
                </React.Fragment>
            ))}
        </div>
    );
}

function StudentProfilePanel({ student, onClose }) {
    if (!student) return null;
    const cgpaColor = student.cgpa >= 8.5 ? 'text-emerald-600 dark:text-emerald-300' : student.cgpa >= 7 ? 'text-blue-600 dark:text-blue-300' : 'text-slate-700 dark:text-slate-200';
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-[fade-in_0.15s_ease-out]">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-lg overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                    <h3 className="font-bold text-slate-900 dark:text-slate-100">Candidate Profile</h3>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500"><X size={18}/></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm">
                            {student.profilePicture
                                ? <img src={student.profilePicture} alt={student.fullName} className="w-full h-full object-cover"/>
                                : <User size={32} className="text-slate-400"/>}
                        </div>
                        <div>
                            <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{student.fullName || '—'}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{student.email}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                            { icon: <Hash size={14}/>, label: 'Roll No', val: student.rollNumber },
                            { icon: <GraduationCap size={14}/>, label: 'Program', val: student.program },
                            { icon: <Building2 size={14}/>, label: 'Branch', val: student.department },
                            { icon: <Clock size={14}/>, label: 'Year', val: student.currentYearOfStudy },
                        ].map(({ icon, label, val }) => (
                            <div key={label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                                <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mb-1">{icon}{label}</p>
                                <p className="font-semibold text-slate-800 dark:text-slate-200">{val || '—'}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                        <Star size={18} className="text-yellow-400 fill-yellow-400"/>
                        <div>
                            <p className="text-xs text-slate-400 dark:text-slate-500">CGPA</p>
                            <p className={`text-xl font-extrabold ${cgpaColor}`}>{student.cgpa != null ? Number(student.cgpa).toFixed(2) : 'N/A'}<span className="text-xs font-normal text-slate-400 ml-1">/ 10</span></p>
                        </div>
                    </div>
                    {student.resumeLink ? (
                        <a href={student.resumeLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition shadow shadow-blue-500/20">
                            <FileText size={16}/> View Resume <ExternalLink size={13} className="opacity-70"/>
                        </a>
                    ) : (
                        <div className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 text-slate-400 py-2.5 rounded-xl font-semibold border border-slate-200 dark:border-slate-700">
                            <FileText size={16}/> No Resume Uploaded
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function CompanyApplicantDashboard({ event, onBack }) {
    const { token } = useAuth();

    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);

    const [selectedRound, setSelectedRound] = useState(null);
    const [search, setSearch] = useState('');
    const [branch, setBranch] = useState('');
    const [year, setYear] = useState('');

    const [actionLoading, setActionLoading] = useState({});
    const [profileStudent, setProfileStudent] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const rounds = event?.rounds || [];

    const fetchApplicants = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page };
            if (selectedRound !== null) params.roundIndex = selectedRound;
            if (search.trim()) params.search = search.trim();
            if (branch) params.branch = branch;
            if (year) params.year = year;

            const { data } = await api.get(`/api/events/${event._id}/applicants`, {
                headers: { Authorization: `Bearer ${token}` },
                params,
            });
            setApplicants(data.applicants || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('fetchApplicants Error:', err);
        } finally {
            setLoading(false);
        }
    }, [token, event._id, page, selectedRound, search, branch, year]);

    useEffect(() => { fetchApplicants(); }, [fetchApplicants]);

    // Reset to page 0 when filters change
    useEffect(() => { setPage(0); }, [selectedRound, search, branch, year]);

    const handleAction = async (applicationId, action, studentName) => {
        const key = `${applicationId}-${action}`;
        setActionLoading(prev => ({ ...prev, [key]: true }));
        try {
            await api.post(`/api/events/application/${applicationId}/action`, { action }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchApplicants();
        } catch (err) {
            console.error('handleAction Error:', err);
            alert(`Failed to ${action} applicant. Please try again.`);
        } finally {
            setActionLoading(prev => ({ ...prev, [key]: false }));
        }
    };

    const currentRoundInfo = selectedRound !== null ? rounds[selectedRound] : null;

    return (
        <div className="space-y-6 animate-[fade-in-up_0.4s_ease-out]">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 p-6">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm hover:text-blue-800 dark:hover:text-blue-200 mb-5 bg-blue-50 dark:bg-blue-950/30 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-900 transition-colors"
                >
                    <ArrowLeft size={16}/> Back to Events
                </button>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{event.title}</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            <span className="font-semibold text-slate-700 dark:text-slate-200">{total}</span> total applicant{total !== 1 ? 's' : ''} &nbsp;·&nbsp; {rounds.length} round{rounds.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    {currentRoundInfo?.endDate && (
                        <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl border ${new Date(currentRoundInfo.endDate) < new Date() ? 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900' : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900'}`}>
                            <Clock size={15}/>
                            {new Date(currentRoundInfo.endDate) < new Date() ? 'Round ended' : `Round ends ${new Date(currentRoundInfo.endDate).toLocaleDateString()}`}
                        </div>
                    )}
                </div>

                {/* Round Breadcrumbs */}
                {rounds.length > 0 && (
                    <div className="mb-5">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Filter by Round</p>
                        <RoundBreadcrumbs rounds={rounds} selected={selectedRound} onSelect={setSelectedRound}/>
                    </div>
                )}

                {/* Search + Filters bar */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                        <input
                            type="text"
                            placeholder="Search by name or roll number…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(v => !v)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition ${showFilters ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
                    >
                        <Filter size={15}/> Filters {(branch || year) && <span className="w-2 h-2 rounded-full bg-white/70 inline-block"/>}
                    </button>
                </div>

                {showFilters && (
                    <div className="mt-3 flex flex-col gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 animate-[fade-in-up_0.2s_ease-out]">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <select value={branch} onChange={e => setBranch(e.target.value)} className="w-full sm:w-auto px-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400 transition">
                                <option value="">All Branches</option>
                                {BRANCH_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                            {(branch || year) && (
                                <button onClick={() => { setBranch(''); setYear(''); }} className="shrink-0 px-4 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-100 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/50 transition self-start sm:self-auto">Clear Filters</button>
                            )}
                        </div>

                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Filter by Year</p>
                            <div className="flex flex-wrap gap-2">
                                <button 
                                    onClick={() => setYear('')}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${!year ? 'bg-blue-600 text-white border-transparent shadow-[0_2px_10px_-2px_rgba(37,99,235,0.4)]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
                                >
                                    All
                                </button>
                                {YEAR_OPTIONS.map(y => (
                                    <button 
                                        key={y}
                                        onClick={() => setYear(y)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${year === y ? 'bg-blue-600 text-white border-transparent shadow-[0_2px_10px_-2px_rgba(37,99,235,0.4)]' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-400'}`}
                                    >
                                        {y}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Applicant Table */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center gap-3 p-16 text-slate-400 dark:text-slate-500">
                        <Loader2 size={22} className="animate-spin"/><span className="font-medium">Loading applicants…</span>
                    </div>
                ) : applicants.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 p-16 text-center text-slate-500 dark:text-slate-400">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            <Search size={24} className="text-slate-300 dark:text-slate-500"/>
                        </div>
                        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">No applicants found</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">
                            {search || branch || year ? 'Try adjusting your search or filters.' : 'Students appear here once they apply to this event.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
                            <thead className="bg-slate-50 dark:bg-slate-800/60">
                                <tr>
                                    {['Candidate', 'Roll No', 'Program / Branch', 'CGPA', 'Round Status', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/80">
                                {applicants.map(app => {
                                    const s = app.studentId || {};
                                    const isExpired = app.effectiveStatus === 'auto_rejected';
                                    const isTerminal = app.status === 'accepted' || app.status === 'rejected';
                                    const statusCfg = STATUS_CONFIG[app.effectiveStatus] || STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
                                    const acceptKey = `${app._id}-accept`;
                                    const rejectKey = `${app._id}-reject`;

                                    return (
                                        <tr key={app._id} className={`transition-colors ${isExpired || isTerminal ? 'opacity-60' : 'hover:bg-blue-50/40 dark:hover:bg-slate-800/50'}`}>
                                            <td className="px-5 py-4">
                                                <button onClick={() => setProfileStudent(s)} className="text-left group">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors">{s.fullName || '—'}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{s.email || '—'}</p>
                                                </button>
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">{s.rollNumber || '—'}</td>
                                            <td className="px-5 py-4">
                                                <span className="text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900 px-2 py-0.5 rounded-full mr-1.5">{s.program || '—'}</span>
                                                <span className="text-sm text-slate-600 dark:text-slate-300">{s.department || '—'}</span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`text-sm font-bold ${s.cgpa >= 8.5 ? 'text-emerald-600 dark:text-emerald-300' : 'text-slate-700 dark:text-slate-200'}`}>
                                                    {s.cgpa != null ? Number(s.cgpa).toFixed(2) : 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${statusCfg.cls}`}>
                                                    {isExpired && <AlertTriangle size={11}/>}
                                                    {statusCfg.label}
                                                </span>
                                                {rounds.length > 0 && !isTerminal && !isExpired && (
                                                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                                        {rounds[app.currentRoundIndex]?.title || `Round ${app.currentRoundIndex + 1}`}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                {!isTerminal && !isExpired ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleAction(app._id, 'accept', s.fullName)}
                                                            disabled={!!actionLoading[acceptKey]}
                                                            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm shadow-emerald-500/20 disabled:opacity-50"
                                                        >
                                                            {actionLoading[acceptKey] ? <Loader2 size={12} className="animate-spin"/> : <Check size={13}/>}
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(app._id, 'reject', s.fullName)}
                                                            disabled={!!actionLoading[rejectKey]}
                                                            className="flex items-center gap-1 bg-red-100 hover:bg-red-600 hover:text-white text-red-700 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-600 dark:hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition border border-red-200 dark:border-red-900 disabled:opacity-50"
                                                        >
                                                            {actionLoading[rejectKey] ? <Loader2 size={12} className="animate-spin"/> : <X size={13}/>}
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400 dark:text-slate-500 italic">No action</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Page {page + 1} of {totalPages} &nbsp;·&nbsp; {total} result{total !== 1 ? 's' : ''}
                        </p>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition">
                                <ChevronLeft size={16}/>
                            </button>
                            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 transition">
                                <ChevronRight size={16}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Student Profile Modal */}
            {profileStudent && <StudentProfilePanel student={profileStudent} onClose={() => setProfileStudent(null)}/>}
        </div>
    );
}
