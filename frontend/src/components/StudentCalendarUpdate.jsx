import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, PlusCircle, Trash2, Clock, MapPin, Users, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function StudentCalendarUpdate() {
    const { token, user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'internship',
        startDate: '',
        deadlineEnd: '',
        targetBranches: '',
        linkUrl: '',
        linkLabel: '',
        companyEmail: ''
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/events', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setEvents(data.events);
        } catch (err) {
            console.error('Failed to fetch events', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // Process branches and links
            const processedBranches = formData.targetBranches.split(',').map(b => b.trim()).filter(Boolean);
            const links = formData.linkUrl ? [{ url: formData.linkUrl, label: formData.linkLabel || formData.linkUrl }] : [];

            // Backend expectation payload
            const payload = {
                title: formData.title,
                description: formData.description,
                type: formData.type,
                startDate: formData.startDate,
                endDate: formData.deadlineEnd,
                deadline: formData.deadlineEnd,
                targetBranches: processedBranches.length > 0 ? processedBranches : ['All'],
                links,
                companyEmail: formData.companyEmail || undefined
            };

            await axios.post('http://localhost:5000/api/admin/events', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('Event successfully created!');
            setFormData({
                title: '', description: '', type: 'internship',
                startDate: '', deadlineEnd: '',
                targetBranches: '', linkUrl: '', linkLabel: '', companyEmail: ''
            });
            fetchEvents();

            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setMessage('Error creating event');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you certain you want to delete this event? This action will remove it from all student calendars.')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/events/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchEvents();
        } catch (err) {
            console.error('Error deleting event', err);
            alert('Failed to delete event');
        }
    };

    if (user?.adminType !== 'super_admin' && user?.adminType !== 'student_admin') {
        return <div className="p-8 text-center text-red-500 font-bold">Unauthorized. Student Admin access required.</div>;
    }

    return (
        <div className="space-y-8 animate-[fade-in-up_0.5s_ease-out]">
            {/* Creation Form */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-[100px] -z-10 opacity-50"></div>

                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                    <CalendarIcon className="text-indigo-500" /> Create New Calendar Event
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <div className="lg:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event Title *</label>
                            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all" placeholder="e.g. Goldman Sachs Hiring Drive" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Type *</label>
                            <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all cursor-pointer">
                                <option value="internship">Internship</option>
                                <option value="placement_drive">Placement Drive</option>
                                <option value="workshop">Workshop</option>
                            </select>
                        </div>

                        <div className="lg:col-span-3">
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Description *</label>
                            <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl h-24 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none" placeholder="Provide details about the event, eligibility, and process..."></textarea>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Start Date & Time *</label>
                            <input type="datetime-local" required value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-rose-600">Application Deadline / End Date</label>
                            <input type="datetime-local" value={formData.deadlineEnd} onChange={e => setFormData({ ...formData, deadlineEnd: e.target.value })} className="w-full px-4 py-2 bg-rose-50 border border-rose-200 rounded-xl focus:ring-2 focus:ring-rose-100 focus:border-rose-400 outline-none text-rose-700" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Associated Company Email</label>
                            <input type="email" value={formData.companyEmail} onChange={e => setFormData({ ...formData, companyEmail: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none" placeholder="e.g. hr@company.com" />
                            <p className="text-[10px] text-slate-500 mt-1">Enter the registered email of the company to give them access to the applicant list.</p>
                        </div>

                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-slate-100 pt-5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Target Branches</label>
                                <input type="text" value={formData.targetBranches} onChange={e => setFormData({ ...formData, targetBranches: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="All, CSE, EE, ME (comma separated)" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">External Link URL</label>
                                <input type="url" value={formData.linkUrl} onChange={e => setFormData({ ...formData, linkUrl: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="https://forms.gle/..." />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Link Button Label</label>
                                <input type="text" value={formData.linkLabel} onChange={e => setFormData({ ...formData, linkLabel: e.target.value })} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-100 outline-none" placeholder="e.g. Apply Here" />
                            </div>
                        </div>
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm font-bold shadow-inner flex items-center gap-2 ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                            <div className={`w-2 h-2 rounded-full ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}></div>
                            {message}
                        </div>
                    )}

                    <div className="flex justify-end pt-2">
                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle size={18} />}
                            {isSubmitting ? 'Creating...' : 'Publish Event to Calendar'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Event List Management */}
            <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                    <span>Manage Existing Events</span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200">{events.length} Total</span>
                </h3>

                {loading ? (
                    <div className="flex justify-center items-center py-12 text-slate-400">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">No active events found in the database.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                        {events.map(ev => {
                            const isPast = new Date(ev.endDate || ev.startDate) < new Date();
                            return (
                                <div key={ev._id} className={`p-5 border rounded-xl relative group flex flex-col transition-all ${isPast ? 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100' : 'bg-white border-indigo-100 shadow-sm hover:shadow-md'}`}>

                                    {/* Delete Button */}
                                    <button onClick={() => handleDelete(ev._id)} className="absolute top-3 right-3 p-2 bg-white rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all border border-transparent hover:border-red-100 z-10">
                                        <Trash2 size={16} />
                                    </button>

                                    <div className="mb-3 pr-8">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${ev.type === 'internship' ? 'bg-blue-100 text-blue-700' : ev.type === 'placement_drive' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {ev.type.replace('_', ' ')}
                                            </span>
                                            {isPast && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-600">Past</span>}
                                        </div>
                                        <h4 className="font-bold text-slate-900 leading-tight">{ev.title}</h4>
                                    </div>

                                    <div className="space-y-2 mt-auto text-xs text-slate-600 mb-4">
                                        <div className="flex items-start gap-2">
                                            <Clock className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                                            <span>
                                                {new Date(ev.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                {ev.endDate !== ev.startDate && ` - ${new Date(ev.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                            <span className="truncate">{ev.targetBranches.join(', ')}</span>
                                        </div>

                                        {ev.deadline && (
                                            <div className="flex items-start gap-2 text-rose-600 font-medium bg-rose-50 px-2 py-1 rounded inline-flex">
                                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                                Deadline: {new Date(ev.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                                        <span>{ev.appliedStudents?.length || 0} Applied</span>
                                        <span className="truncate text-right w-24" title={ev.createdBy?.fullName}>By {ev.createdBy?.fullName?.split(' ')[0] || 'Admin'}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
