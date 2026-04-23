import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import {
    Briefcase, Layers, CheckCircle2, XCircle, Timer,
    Bell, X, Loader2, ChevronLeft, ChevronRight, AlertTriangle,
} from 'lucide-react';

const APP_STATUS_CONFIG = {
    pending:       { label: 'In Progress',  icon: <Timer size={13}/>,         cls: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900' },
    accepted:      { label: 'Selected',     icon: <CheckCircle2 size={13}/>,  cls: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900' },
    rejected:      { label: 'Rejected',     icon: <XCircle size={13}/>,       cls: 'bg-red-100 text-red-600 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900' },
    auto_rejected: { label: 'Expired',      icon: <Timer size={13}/>,         cls: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700' },
};

const TYPE_STYLES = {
    internship:      'bg-emerald-100 text-emerald-700 border-emerald-200',
    placement_drive: 'bg-violet-100 text-violet-700 border-violet-200',
    workshop:        'bg-blue-100 text-blue-700 border-blue-200',
};

export default function StudentApplications() {
    const { token, user } = useAuth();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [appsPage, setAppsPage] = useState(0);
    const [appsTotalPages, setAppsTotalPages] = useState(1);
    const [appsTotal, setAppsTotal] = useState(0);

    const [historyEvent, setHistoryEvent] = useState(null);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const fetchApplications = useCallback(async () => {
        if (!token || !user) return;
        setLoading(true);
        try {
            const { data } = await api.get('/api/student/applications', {
                headers: { Authorization: `Bearer ${token}` },
                params: { page: appsPage },
            });
            setApplications(data.applications || []);
            setAppsTotal(data.total || 0);
            setAppsTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error('fetchApplications Error:', err);
        } finally {
            setLoading(false);
        }
    }, [token, user, appsPage]);

    useEffect(() => { fetchApplications(); }, [fetchApplications]);

    const openHistory = async (app) => {
        const ev = app.eventId;
        setHistoryEvent({ eventId: ev._id, title: ev.title });
        setHistoryLoading(true);
        setHistory([]);
        try {
            const { data } = await api.get(`/api/student/applications/${ev._id}/history`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setHistory(data.notifications || []);
        } catch (err) {
            console.error('openHistory Error:', err);
        } finally {
            setHistoryLoading(false);
        }
    };

    if (user?.verificationStatus !== 'verified') {
        return (
            <div className="flex flex-col items-center justify-center h-[70vh] text-center max-w-md mx-auto animate-[fade-in-up_0.5s_ease-out]">
                <div className="w-20 h-20 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-yellow-100 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900">
                    <AlertTriangle size={36} strokeWidth={1.5}/>
                </div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">Verification Required</h2>
                <p className="text-slate-500 dark:text-slate-300 leading-relaxed">
                    Your profile must be verified before you can view applied opportunities.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-[fade-in-up_0.5s_ease-out]">
            {/* Header */}
            <div className="bg-white/95 dark:bg-slate-900/90 p-6 rounded-2xl shadow-[0_10px_30px_-18px_rgba(15,23,42,0.45)] border border-slate-100 dark:border-slate-700 backdrop-blur-sm">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
                    <Briefcase className="text-violet-500 dark:text-violet-300" size={26}/>
                    My Applications
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Track all events you've applied to and view your recruitment history.
                </p>
            </div>

            {/* Applications list */}
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                    <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        Applied Opportunities
                        {appsTotal > 0 && (
                            <span className="text-xs font-bold bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 px-2 py-0.5 rounded-full">
                                {appsTotal}
                            </span>
                        )}
                    </h2>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center gap-3 py-16 text-slate-400 dark:text-slate-500">
                        <Loader2 size={22} className="animate-spin"/>
                        <span className="text-sm font-medium">Loading applications…</span>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                            <Briefcase size={24} className="text-slate-300 dark:text-slate-600"/>
                        </div>
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">No applications yet</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Events you apply to from the Calendar &amp; Events page will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50 dark:divide-slate-800">
                        {applications.map(app => {
                            const ev = app.eventId || {};
                            const statusCfg = APP_STATUS_CONFIG[app.effectiveStatus] || APP_STATUS_CONFIG[app.status] || APP_STATUS_CONFIG.pending;
                            const typeStyle = TYPE_STYLES[ev.type] || 'bg-slate-100 text-slate-600 border-slate-200';
                            const rounds = ev.rounds || [];
                            const currentRound = rounds[app.currentRoundIndex];
                            return (
                                <div
                                    key={app._id}
                                    onClick={() => openHistory(app)}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-violet-50/50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/40 flex items-center justify-center shrink-0 border border-violet-200 dark:border-violet-900">
                                        <Layers size={18} className="text-violet-600 dark:text-violet-300"/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors truncate">
                                            {ev.title || 'Unnamed Event'}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${typeStyle}`}>
                                                {(ev.type || 'event').replace('_', ' ').toUpperCase()}
                                            </span>
                                            {currentRound && app.status === 'pending' && (
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                    <Layers size={10}/> {currentRound.title}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full border ${statusCfg.cls}`}>
                                            {statusCfg.icon}{statusCfg.label}
                                        </span>
                                        <p className="text-[11px] text-slate-400 dark:text-slate-500 hidden sm:block">
                                            {new Date(app.updatedAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {appsTotalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                        <p className="text-xs text-slate-400">Page {appsPage + 1} of {appsTotalPages}</p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setAppsPage(p => Math.max(0, p - 1))}
                                disabled={appsPage === 0}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                            >
                                <ChevronLeft size={15}/>
                            </button>
                            <button
                                onClick={() => setAppsPage(p => Math.min(appsTotalPages - 1, p + 1))}
                                disabled={appsPage >= appsTotalPages - 1}
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 transition"
                            >
                                <ChevronRight size={15}/>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Notification History Slide-in Panel */}
            {historyEvent && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-[fade-in_0.15s_ease-out]">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-700 w-full max-w-lg max-h-[80vh] flex flex-col overflow-hidden animate-[fade-in-up_0.25s_ease-out]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                                    <Bell size={16} className="text-violet-500"/> Activity History
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[270px]">{historyEvent.title}</p>
                            </div>
                            <button
                                onClick={() => { setHistoryEvent(null); setHistory([]); }}
                                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition text-slate-400"
                            >
                                <X size={18}/>
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {historyLoading ? (
                                <div className="flex items-center justify-center gap-2 py-10 text-slate-400">
                                    <Loader2 size={18} className="animate-spin"/> Loading history…
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 dark:text-slate-500">
                                    <Bell size={32} className="mx-auto mb-3 text-slate-200 dark:text-slate-700"/>
                                    <p className="text-sm font-medium">No activity yet</p>
                                    <p className="text-xs mt-1">Updates will appear here as selections progress.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {history.map((n, i) => (
                                        <div key={n._id || i} className="flex gap-3">
                                            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-900 flex items-center justify-center shrink-0 mt-0.5">
                                                <Bell size={14} className="text-violet-600 dark:text-violet-300"/>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{n.message}</p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
