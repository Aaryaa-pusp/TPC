import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, PlusCircle } from 'lucide-react';

export default function StudentCalendarUpdate() {
    const { user } = useAuth();

    if (user?.adminType !== 'super_admin' && user?.adminType !== 'student_admin') {
        return <div className="p-8 text-center text-red-500 font-bold dark:text-red-300">Unauthorized. Student Admin access required.</div>;
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 text-center py-16 dark:bg-slate-900/90 dark:border-slate-700/70 dark:shadow-[0_18px_36px_-20px_rgba(2,6,23,0.9)]">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 dark:bg-indigo-950/40 dark:text-indigo-300">
                <CalendarIcon size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2 dark:text-slate-100">Student Calendar Management</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 dark:text-slate-400">
                The complex calendar integration is scheduled for the next development phase. For now, you can mock-create events.
            </p>

            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-2 mx-auto transition-colors dark:bg-indigo-500 dark:hover:bg-indigo-400">
                <PlusCircle size={20} /> Add Placeholder Event
            </button>
        </div>
    );
}
