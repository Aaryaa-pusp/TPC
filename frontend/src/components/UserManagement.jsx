import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Search } from 'lucide-react';

export default function UserManagement() {
    const { user } = useAuth();

    if (user?.adminType !== 'super_admin') {
        return <div className="p-8 text-center text-red-500 font-bold dark:text-red-300">Unauthorized. Super Admin access required.</div>;
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 h-[600px] flex flex-col dark:bg-slate-900/90 dark:border-slate-700/70 dark:shadow-[0_18px_36px_-20px_rgba(2,6,23,0.9)]">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4 dark:border-slate-700">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 dark:text-slate-100">
                    <Users className="text-blue-500 dark:text-blue-400" /> User Management
                </h2>
                <div className="relative w-64">
                    <input type="text" placeholder="Search users by email..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder:text-slate-500" />
                    <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500 w-4 h-4" />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                <Users size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
                <p className="font-semibold text-slate-700 dark:text-slate-200">User Directory Module</p>
                <p className="text-sm mt-1 dark:text-slate-400">This module is scheduled for implementation in Phase 5.</p>
            </div>
        </div>
    );
}
