import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FileSignature, AlertTriangle, UserPlus } from 'lucide-react';

export default function AdminPowerAssignment() {
    const { token, user } = useAuth();
    const [AssignForm, setAssignForm] = useState({ email: '', adminType: user?.adminType === 'super_admin' ? 'announcement_admin' : user?.adminType });
    const [message, setMessage] = useState('');

    const handleAssignPower = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                email: AssignForm.email,
                newAdminType: AssignForm.adminType
            };
            const { data } = await axios.post('http://localhost:5000/api/admin/assign-power', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(data.message);
            setAssignForm({ email: '', adminType: user.adminType === 'super_admin' ? 'announcement_admin' : user.adminType });
        } catch (err) {
            setMessage(err.response?.data?.message || 'Error assigning power');
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 dark:bg-slate-900/90 dark:border-slate-700/70 dark:shadow-[0_18px_36px_-20px_rgba(2,6,23,0.9)]">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4 dark:text-slate-100 dark:border-slate-700">
                <FileSignature className="text-purple-500 dark:text-purple-400" /> Administrative Power Assignment
            </h2>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mb-6 flex items-start gap-3 dark:bg-purple-950/30 dark:border-purple-900">
                <AlertTriangle className="text-purple-600 dark:text-purple-300 shrink-0 mt-0.5" size={20} />
                <p className="text-sm text-purple-900 leading-relaxed font-medium dark:text-purple-200">
                    You can issue administrative privileges here.
                    {user?.adminType !== 'super_admin' ? (
                        <span> As a <strong>{user?.adminType?.replace('_', ' ')}</strong>, you are restricted to creating admins with equivalent permissions.</span>
                    ) : (
                        <span> As a <strong>Super Admin</strong>, you have unrestricted authority to assign any role.</span>
                    )}
                </p>
            </div>

            <form onSubmit={handleAssignPower} className="space-y-5">
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-300">Target Email</label>
                    <input
                        type="email"
                        required
                        value={AssignForm.email}
                        onChange={e => setAssignForm({ ...AssignForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all shadow-sm font-medium dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-blue-500/20"
                        placeholder="colleague@iitp.ac.in"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 dark:text-slate-300">Privilege Level</label>
                    <select
                        value={AssignForm.adminType}
                        onChange={e => setAssignForm({ ...AssignForm, adminType: e.target.value })}
                        disabled={user?.adminType !== 'super_admin'}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all shadow-sm font-medium appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-blue-500/20"
                    >
                        {user?.adminType === 'super_admin' && <option value="super_admin">Super Administrator</option>}
                        {(user?.adminType === 'super_admin' || user?.adminType === 'announcement_admin') && <option value="announcement_admin">Announcement Manager</option>}
                        {(user?.adminType === 'super_admin' || user?.adminType === 'student_admin') && <option value="student_admin">Student Affairs Manager</option>}
                    </select>
                </div>

                {message && (
                    <div className={`p-3 rounded-lg text-sm font-bold shadow-inner ${message.toLowerCase().includes('error') || message.toLowerCase().includes('only create')
                        ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800'
                        : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-800'}`}>
                        {message}
                    </div>
                )}

                <button type="submit" className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-md transition-all flex justify-center items-center gap-2 group hover:-translate-y-0.5 dark:bg-slate-700 dark:hover:bg-slate-600">
                    <UserPlus size={18} className="group-hover:scale-110 transition-transform" /> Grant Access
                </button>
            </form>
        </div>
    );
}
