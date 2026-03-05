import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Megaphone, Clock, ChevronDown, ChevronUp, Bell, Search, BookOpen, Briefcase, MonitorPlay, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';

const TYPE_CONFIG = {
    announcement: { label: 'Announcement', color: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800/60', icon: Megaphone },
    internship: { label: 'Internship', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800/60', icon: Briefcase },
    placement_drive: { label: 'Placement', color: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-400 dark:border-violet-800/60', icon: Briefcase },
    workshop: { label: 'Workshop', color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-400 dark:border-blue-800/60', icon: MonitorPlay },
};

function getTypeConfig(type) {
    return TYPE_CONFIG[type] || { label: type || 'Announcement', color: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700', icon: Bell };
}

export default function StudentAnnouncements() {
    const { token, user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expandedId, setExpandedId] = useState(null);
    const [viewedIds, setViewedIds] = useState(new Set());
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('all');

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10; // Changed from 5 to 10 as per instruction

    useEffect(() => {
        if (token && user) fetchAnnouncements();
    }, [token, user?.department]);

    // Reset page to 1 when search or filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search, filterType]);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const department = user?.department?.trim() || '';
            const program = user?.program?.trim() || '';
            const params = new URLSearchParams();
            if (department) params.append('branch', department);
            if (program) params.append('program', program);

            const { data } = await axios.get(
                `http://localhost:5000/api/student/announcements?${params.toString()}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setAnnouncements(data.announcements);
        } catch (err) {
            console.error('Failed to fetch announcements:', err);
            setError('Could not load announcements.');
        } finally {
            setLoading(false);
        }
    };

    const handleExpand = (id) => {
        setExpandedId(prev => (prev === id ? null : id));
        setViewedIds(prev => new Set([...prev, id]));
    };

    const filtered = announcements.filter(a => {
        const body = a.content || a.description || '';
        const matchesSearch = !search ||
            a.title?.toLowerCase().includes(search.toLowerCase()) ||
            body.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'all' || (a.type || 'announcement') === filterType;
        return matchesSearch && matchesType;
    });

    const uniqueTypes = ['all', ...new Set(announcements.map(a => a.type || 'announcement'))];

    // Pagination Logic
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedAnnouncements = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    if (loading) return (
        <div className="space-y-3 animate-pulse p-2">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-slate-100 rounded-2xl dark:bg-slate-800" />)}
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-64 text-red-500 gap-2">
            <AlertCircle size={36} />
            <p className="font-medium">{error}</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-[fade-in-up_0.5s_ease-out]">

            {/* Header */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 flex items-center gap-4 dark:bg-slate-900 dark:border-slate-700">
                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100 flex-shrink-0 dark:bg-amber-900/30 dark:border-amber-800/50">
                    <Megaphone className="text-amber-500 w-5 h-5" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Announcements</h1>
                    <p className="text-slate-500 text-sm dark:text-slate-400">Filtered for your branch &amp; program &mdash; <span className="font-semibold text-slate-600 dark:text-slate-300">{announcements.length} total</span></p>
                </div>
            </div>

            {/* Search + Type Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search by title or content..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:ring-blue-700/40 dark:focus:border-blue-600"
                    />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    {uniqueTypes.map(type => {
                        const cfg = type === 'all'
                            ? { label: 'All', color: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' }
                            : getTypeConfig(type);
                        const active = filterType === type;
                        return (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${cfg.color} ${active ? 'ring-2 ring-offset-1 ring-blue-300 shadow-sm dark:ring-blue-600' : 'opacity-55 hover:opacity-90'}`}
                            >
                                {cfg.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* List */}
            {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <BookOpen size={40} className="mb-3 opacity-40" />
                    <p className="font-medium">No announcements found.</p>
                    <p className="text-sm mt-1">Try adjusting your search or filter.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {paginatedAnnouncements.map(a => {
                            const id = a._id;
                            const isExpanded = expandedId === id;
                            const isViewed = viewedIds.has(id);
                            const cfg = getTypeConfig(a.type);
                            const Icon = cfg.icon;
                            const body = a.content || a.description || 'No details provided.';

                            return (
                                <div
                                    key={id}
                                    className={`bg-white rounded-xl border overflow-hidden transition-all duration-300 dark:bg-slate-900/50
                                        ${isExpanded
                                            ? 'border-blue-300 shadow-md shadow-blue-500/10 dark:border-blue-500/50'
                                            : isViewed
                                                ? 'border-slate-200 opacity-75 dark:border-slate-800 dark:opacity-80'
                                                : 'border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md dark:border-slate-700 dark:hover:border-slate-500'
                                        }`}
                                >
                                    {/* Clickable Header Row */}
                                    <button
                                        onClick={() => handleExpand(id)}
                                        className="w-full text-left px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 group"
                                    >
                                        {/* Left Status & Icon */}
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.color} border shadow-sm`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                        </div>

                                        {/* Center Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase border ${cfg.color}`}>
                                                    {cfg.label}
                                                </span>
                                                {isViewed && !isExpanded && (
                                                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full dark:bg-slate-800 dark:text-slate-400 font-medium">Viewed</span>
                                                )}
                                            </div>
                                            <h3 className={`font-bold text-base md:text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors ${isViewed && !isExpanded ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                                {a.title}
                                            </h3>
                                            {!isExpanded && (
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-1 pr-6">{body}</p>
                                            )}
                                        </div>

                                        {/* Right Date & Chevron */}
                                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 mt-4 sm:mt-0 flex-shrink-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 pt-3 sm:pt-0">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                                <Clock size={14} />
                                                <span>{a.createdAt ? format(new Date(a.createdAt), 'dd MMM yyyy') : '—'}</span>
                                            </div>
                                            <div className="hidden sm:flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                                                {isExpanded
                                                    ? <ChevronUp className="w-5 h-5 text-blue-500" />
                                                    : <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                                                }
                                            </div>
                                        </div>
                                    </button>

                                    {/* Expanded Detail Panel */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800/60 animate-[fade-in-up_0.3s_ease-out]">
                                            <div className="bg-slate-50/50 rounded-xl p-5 border border-slate-100 dark:bg-slate-800/40 dark:border-slate-700/60 shadow-inner">
                                                <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 dark:text-slate-500">
                                                    <BookOpen size={14} /> Description
                                                </h4>
                                                <p className="text-sm md:text-base text-slate-700 leading-relaxed whitespace-pre-wrap dark:text-slate-300">{body}</p>
                                            </div>
                                            <div className="mt-4 flex flex-wrap gap-4 items-center">
                                                {a.targetBranches?.length > 0 && (
                                                    <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Branches</span>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {a.targetBranches.map(b => (
                                                                <span key={b} className="text-xs bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-bold dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800">{b}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                                {a.targetAudience && a.targetAudience !== 'all' && (
                                                    <div className="flex items-center gap-2.5 bg-white dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                                                        <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Audience</span>
                                                        <span className="text-xs bg-violet-100 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-md font-bold capitalize dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800">{a.targetAudience}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-200 dark:border-slate-800">
                            <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} entries
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                                    aria-label="Previous pane"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <div className="flex items-center gap-1">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setCurrentPage(i + 1)}
                                            className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${currentPage === i + 1
                                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                                                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}