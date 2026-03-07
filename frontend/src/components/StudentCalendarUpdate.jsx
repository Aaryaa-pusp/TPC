import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    Calendar as CalendarIcon,
    PlusCircle,
    Trash2,
    Clock,
    Users,
    Loader2,
    Search,
    ChevronLeft,
    ChevronRight,
    Pencil,
    X,
} from 'lucide-react';

const BRANCHES = ['CSE', 'EE', 'ME', 'MME'];
const PROGRAMS = ['B.Tech', 'M.Tech', 'M.Sc', 'PhD'];
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year', '5th Year'];

const INITIAL_FORM_STATE = {
    title: '',
    description: '',
    type: 'internship',
    startDate: '',
    deadlineEnd: '',
    targetPrograms: [],
    targetBranches: [],
    targetYears: [],
    linkUrl: '',
    linkLabel: '',
    companyEmail: '',
};

// Reusable checkbox group for targets
function TargetCheckboxes({ options, value, onChange }) {
    const allChecked = value.length === 0;

    const toggle = (opt) => {
        if (opt === 'ALL') {
            onChange([]);
        } else {
            const next = value.includes(opt)
                ? value.filter(o => o !== opt)
                : [...value, opt];
            onChange(next);
        }
    };

    const checkboxCls = (active) =>
        `flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer select-none transition-all
        ${active
            ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
            : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-500'}`;

    return (
        <div className="flex flex-wrap gap-2">
            <label className={checkboxCls(allChecked)}>
                <input type="checkbox" className="hidden" checked={allChecked} onChange={() => toggle('ALL')} />
                All
            </label>
            {options.map(opt => {
                const active = value.includes(opt);
                return (
                    <label key={opt} className={checkboxCls(active)}>
                        <input type="checkbox" className="hidden" checked={active} onChange={() => toggle(opt)} />
                        {opt}
                    </label>
                );
            })}
        </div>
    );
}

const EVENT_TYPE_OPTIONS = [
    { value: 'internship', label: 'Internship' },
    { value: 'placement_drive', label: 'Placement Drive' },
    { value: 'workshop', label: 'Workshop' },
];

const EVENT_TYPE_BADGES = {
    internship: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    placement_drive: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
    workshop: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
};

const formatDateTime = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function StudentCalendarUpdate() {
    const { token, user } = useAuth();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Search / Filter / Pagination
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;

    // Edit state
    const [editingEvent, setEditingEvent] = useState(null);
    const [editForm, setEditForm] = useState(INITIAL_FORM_STATE);
    const [editSubmitting, setEditSubmitting] = useState(false);

    const openEdit = (ev) => {
        setEditingEvent(ev);
        const firstLink = ev.links?.[0] || {};
        setEditForm({
            title: ev.title || '',
            description: ev.description || '',
            type: ev.type || 'internship',
            startDate: ev.startDate ? new Date(ev.startDate).toISOString().slice(0, 16) : '',
            deadlineEnd: ev.endDate ? new Date(ev.endDate).toISOString().slice(0, 16) : '',
            targetPrograms: ev.targetPrograms || [],
            targetBranches: ev.targetBranches || [],
            targetYears: ev.targetYears || [],
            linkUrl: firstLink.url || '',
            linkLabel: firstLink.label || '',
            companyEmail: ev.companyEmail || '',
        });
    };

    const closeEdit = () => { setEditingEvent(null); setEditForm(INITIAL_FORM_STATE); };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditSubmitting(true);
        try {
            const links = editForm.linkUrl
                ? [{ url: editForm.linkUrl.trim(), label: editForm.linkLabel.trim() || editForm.linkUrl.trim() }]
                : [];
            const payload = {
                title: editForm.title.trim(),
                description: editForm.description.trim(),
                type: editForm.type,
                startDate: editForm.startDate,
                endDate: editForm.deadlineEnd || undefined,
                deadline: editForm.deadlineEnd || undefined,
                targetPrograms: editForm.targetPrograms,
                targetBranches: editForm.targetBranches.length ? editForm.targetBranches : ['All'],
                targetYears: editForm.targetYears,
                links,
                companyEmail: editForm.companyEmail.trim() || undefined,
            };
            await axios.put(`http://localhost:5000/api/admin/events/${editingEvent._id}`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            closeEdit();
            fetchEvents();
        } catch (err) {
            console.error('Error updating event', err);
        } finally {
            setEditSubmitting(false);
        }
    };

    // Derived list
    const filteredEvents = events.filter(ev => {
        const matchesSearch = !search ||
            ev.title?.toLowerCase().includes(search.toLowerCase()) ||
            ev.description?.toLowerCase().includes(search.toLowerCase());
        const matchesType = filterType === 'ALL' || ev.type === filterType;
        return matchesSearch && matchesType;
    });

    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const paginatedEvents = filteredEvents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    const fetchEvents = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/events', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setEvents(data.events || []);
        } catch (err) {
            console.error('Failed to fetch events', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    useEffect(() => {
        if (!message.text) return undefined;
        const timeout = setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        return () => clearTimeout(timeout);
    }, [message]);

    const updateField = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const processedPrograms = formData.targetPrograms;
            const processedBranches = formData.targetBranches;
            const processedYears = formData.targetYears;

            const links = formData.linkUrl
                ? [{ url: formData.linkUrl.trim(), label: formData.linkLabel.trim() || formData.linkUrl.trim() }]
                : [];

            const payload = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                type: formData.type,
                startDate: formData.startDate,
                endDate: formData.deadlineEnd || undefined,
                deadline: formData.deadlineEnd || undefined,
                targetPrograms: processedPrograms.length ? processedPrograms : [],
                targetBranches: processedBranches.length ? processedBranches : ['All'],
                targetYears: processedYears.length ? processedYears : [],
                links,
                companyEmail: formData.companyEmail.trim() || undefined,
            };

            await axios.post('http://localhost:5000/api/admin/events', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage({ type: 'success', text: 'Event successfully created.' });
            setFormData(INITIAL_FORM_STATE);
            fetchEvents();
        } catch (err) {
            setMessage({ type: 'error', text: 'Error creating event.' });
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        const ok = window.confirm('Are you certain you want to delete this event? This removes it from all student calendars.');
        if (!ok) return;

        try {
            await axios.delete(`http://localhost:5000/api/admin/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchEvents();
        } catch (err) {
            console.error('Error deleting event', err);
            setMessage({ type: 'error', text: 'Failed to delete event.' });
        }
    };

    if (user?.adminType !== 'super_admin' && user?.adminType !== 'student_admin') {
        return (
            <div className="p-8 text-center text-red-500 font-bold dark:text-red-300">
                Unauthorized. Student Admin access required.
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-[fade-in-up_0.5s_ease-out]">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 dark:bg-indigo-950/30 rounded-bl-[100px] -z-10 opacity-50" />

                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                    <CalendarIcon className="text-indigo-500" /> Create New Calendar Event
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Event Title *</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-slate-100"
                                placeholder="e.g. Goldman Sachs Hiring Drive"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Type *</label>
                            <select
                                value={formData.type}
                                onChange={(e) => updateField('type', e.target.value)}
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 outline-none transition-all cursor-pointer text-slate-900 dark:text-slate-100"
                            >
                                {EVENT_TYPE_OPTIONS.map((opt) => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="lg:col-span-3">
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Description *</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-24 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 outline-none transition-all resize-none text-slate-900 dark:text-slate-100"
                                placeholder="Provide details about eligibility and process..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Start Date & Time *</label>
                            <input
                                type="datetime-local"
                                required
                                value={formData.startDate}
                                onChange={(e) => updateField('startDate', e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-rose-600 dark:text-rose-300 uppercase tracking-wider mb-2">Application Deadline / End Date</label>
                            <input
                                type="datetime-local"
                                value={formData.deadlineEnd}
                                onChange={(e) => updateField('deadlineEnd', e.target.value)}
                                className="w-full px-4 py-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900 focus:border-rose-400 outline-none text-rose-700 dark:text-rose-300"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Associated Company Email</label>
                            <input
                                type="email"
                                value={formData.companyEmail}
                                onChange={(e) => updateField('companyEmail', e.target.value)}
                                className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-500 outline-none text-slate-900 dark:text-slate-100"
                                placeholder="e.g. hr@company.com"
                            />
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                                Enter the registered company email to link this event to its applicant list.
                            </p>
                        </div>

                        <div className="lg:col-span-3 grid grid-cols-1 gap-5 border-t border-slate-100 dark:border-slate-700 pt-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Target Programs</label>
                                <TargetCheckboxes
                                    options={PROGRAMS}
                                    value={formData.targetPrograms}
                                    onChange={(v) => updateField('targetPrograms', v)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Target Years</label>
                                <TargetCheckboxes
                                    options={YEARS}
                                    value={formData.targetYears}
                                    onChange={(v) => updateField('targetYears', v)}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Target Branches</label>
                                <TargetCheckboxes
                                    options={BRANCHES}
                                    value={formData.targetBranches}
                                    onChange={(v) => updateField('targetBranches', v)}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-slate-100 dark:border-slate-700 pt-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">External Link URL</label>
                                <input
                                    type="url"
                                    value={formData.linkUrl}
                                    onChange={(e) => updateField('linkUrl', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none text-slate-900 dark:text-slate-100"
                                    placeholder="https://forms.gle/..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">Link Button Label</label>
                                <input
                                    type="text"
                                    value={formData.linkLabel}
                                    onChange={(e) => updateField('linkLabel', e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900 outline-none text-slate-900 dark:text-slate-100"
                                    placeholder="e.g. Apply Here"
                                />
                            </div>
                        </div>
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded-lg text-sm font-bold shadow-inner flex items-center gap-2 border ${message.type === 'error'
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900'
                            : 'bg-green-50 text-green-700 border-green-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${message.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`} />
                            {message.text}
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle size={18} />}
                            {isSubmitting ? 'Creating...' : 'Publish Event to Calendar'}
                        </button>
                    </div>
                </form>
            </div>

            {/* ── Edit Modal ── */}
            {editingEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
                    <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 my-4">
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Pencil size={15} className="text-indigo-500" /> Edit Event
                            </h3>
                            <button onClick={closeEdit} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors">
                                <X size={16} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Title *</label>
                                    <input required type="text" value={editForm.title}
                                        onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-slate-900 dark:text-slate-100" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Type</label>
                                    <select value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none text-slate-900 dark:text-slate-100">
                                        {EVENT_TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Start Date &amp; Time *</label>
                                    <input required type="datetime-local" value={editForm.startDate}
                                        onChange={e => setEditForm({ ...editForm, startDate: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none text-slate-900 dark:text-slate-100" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-rose-600 dark:text-rose-300 uppercase tracking-wider mb-1">Deadline / End Date</label>
                                    <input type="datetime-local" value={editForm.deadlineEnd}
                                        onChange={e => setEditForm({ ...editForm, deadlineEnd: e.target.value })}
                                        className="w-full px-4 py-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl focus:ring-2 focus:ring-rose-100 outline-none text-rose-700 dark:text-rose-300" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Description *</label>
                                    <textarea required value={editForm.description}
                                        onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl h-20 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none resize-none text-slate-900 dark:text-slate-100" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Target Programs</label>
                                    <TargetCheckboxes options={PROGRAMS} value={editForm.targetPrograms} onChange={v => setEditForm({ ...editForm, targetPrograms: v })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Target Years</label>
                                    <TargetCheckboxes options={YEARS} value={editForm.targetYears} onChange={v => setEditForm({ ...editForm, targetYears: v })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">Target Branches</label>
                                    <TargetCheckboxes options={BRANCHES} value={editForm.targetBranches} onChange={v => setEditForm({ ...editForm, targetBranches: v })} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-1">
                                <button type="button" onClick={closeEdit}
                                    className="px-5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                    Cancel
                                </button>
                                <button type="submit" disabled={editSubmitting}
                                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-sm hover:shadow-md transition-all disabled:opacity-60">
                                    <Pencil size={14} /> {editSubmitting ? 'Saving…' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700">
                {/* Header + Search + Filters */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex-shrink-0">
                        Manage Existing Events
                        <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700 font-medium">
                            {filteredEvents.length} / {events.length}
                        </span>
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64 flex-shrink-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search events..."
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
                            />
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto gap-1">
                            {['ALL', ...EVENT_TYPE_OPTIONS.map(o => o.value)].map(t => (
                                <button key={t}
                                    onClick={() => { setFilterType(t); setCurrentPage(1); }}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${filterType === t
                                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                                        }`}>
                                    {t === 'ALL' ? 'All' : EVENT_TYPE_OPTIONS.find(o => o.value === t)?.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                        <CalendarIcon className="w-12 h-12 text-slate-300 dark:text-slate-500 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-300 font-medium">No events match your criteria.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {paginatedEvents.map((ev) => {
                                const isPast = new Date(ev.endDate || ev.startDate) < new Date();
                                const typeBadge = EVENT_TYPE_BADGES[ev.type] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';

                                return (
                                    <div
                                        key={ev._id}
                                        className={`p-5 border rounded-xl relative group flex flex-col transition-all ${isPast
                                            ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                                            : 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/40 shadow-sm hover:shadow-md'
                                            }`}
                                    >
                                        {/* Action buttons */}
                                        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEdit(ev)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors border border-transparent hover:border-indigo-100"
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(ev._id)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors border border-transparent hover:border-red-100"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>

                                        <div className="mb-3 pr-14">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${typeBadge}`}>
                                                    {(ev.type || 'event').replace('_', ' ')}
                                                </span>
                                                {isPast && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                        Past
                                                    </span>
                                                )}
                                            </div>
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 leading-tight">{ev.title}</h4>
                                        </div>

                                        <div className="space-y-2 mt-auto text-xs text-slate-600 dark:text-slate-300 mb-4">
                                            <div className="flex items-start gap-2">
                                                <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                                <span>{formatDateTime(ev.startDate)}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                <span className="truncate">{(ev.targetBranches || []).join(', ') || 'All'}</span>
                                            </div>
                                            {ev.deadline && (
                                                <div className="flex items-start gap-2 text-rose-600 dark:text-rose-300 font-medium bg-rose-50 dark:bg-rose-950/30 px-2 py-1 rounded">
                                                    <Clock className="w-3.5 h-3.5 shrink-0" />
                                                    Deadline: {formatDateTime(ev.deadline)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs font-semibold text-slate-400 dark:text-slate-500">
                                            <span>{ev.appliedStudents?.length || 0} Applied</span>
                                            <span className="truncate text-right w-28" title={ev.createdBy?.fullName}>
                                                By {ev.createdBy?.fullName?.split(' ')[0] || 'Admin'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-6 mt-6">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    <ChevronLeft size={16} /> Previous
                                </button>
                                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                    Page {currentPage} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                                >
                                    Next <ChevronRight size={16} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
