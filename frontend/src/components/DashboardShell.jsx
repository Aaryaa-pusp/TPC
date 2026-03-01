import React from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserCircle, LogOut, Bell, Building, CheckCircle, Database, Calendar as CalendarIcon, FileText, Settings, ShieldAlert, LayoutDashboard } from 'lucide-react';

export default function DashboardShell() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Redirect to correct sub-dashboard if user hits /dashboard directly
    const pathname = window.location.pathname;
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
        return <Navigate to={`/dashboard/${user.role}`} replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarItem = ({ icon: Icon, label, path, disabled }) => {
        const isActive = window.location.pathname.includes(path);
        return (
            <button
                disabled={disabled}
                onClick={() => { if (!disabled && path) navigate(path); }}
                className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-xl text-sm font-semibold transition-all duration-200 ${disabled
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100'
                    : isActive ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm group'
                    }`}
            >
                <Icon className={`w-5 h-5 ${disabled ? 'text-gray-400' : isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-blue-600 transition-colors'}`} />
                <span>{label}</span>
                {disabled && <ShieldAlert className="w-4 h-4 ml-auto text-yellow-500" title="Verification Pending" />}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            {/* Top Navbar */}
            <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm shadow-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm shadow-md">
                        TPC
                    </div>
                    <span className="font-bold text-slate-800 hidden sm:block">IIT Patna Portal</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-500 hidden md:block bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Access
                    </span>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50">
                        <LogOut size={16} />
                        <span className="hidden sm:block">Sign out</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-30 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)]">
                    {/* Profile Widget */}
                    <div className="p-6 border-b border-slate-100">
                        <div className="flex flex-col items-center">
                            <div className="relative group cursor-pointer mb-4">
                                <div className="w-20 h-20 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full flex items-center justify-center shadow-inner border-4 border-whte ring-1 ring-slate-200">
                                    <UserCircle size={40} strokeWidth={1} className="text-blue-400" />
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-white text-xs font-medium">Edit</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-900 drop-shadow-sm">{user.email ? user.email.split('@')[0] : 'User'}</h3>
                            <p className="text-xs font-semibold text-blue-600 mt-1 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                                {user.role}
                            </p>
                        </div>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-4">Menu</div>

                        <SidebarItem icon={LayoutDashboard} label="Dashboard Home" path={`/dashboard/${user.role}`} />

                        {user.role === 'student' && (
                            <>
                                <SidebarItem icon={Bell} label="Announcements" path="/dashboard/student/announcements" />
                                <SidebarItem icon={CalendarIcon} label="Calendar & Events" path="/dashboard/student/calendar" />
                                <SidebarItem icon={FileText} label="My Resumes" path="/dashboard/student/resumes" />
                                <SidebarItem icon={CheckCircle} label="Verify Yourself" path="/dashboard/student/verify" />
                            </>
                        )}

                        {user.role === 'company' && (
                            <>
                                <SidebarItem
                                    icon={Database}
                                    label="Student Database"
                                    path="/dashboard/company/database"
                                    disabled={user.verificationStatus === 'pending'}
                                />
                                <SidebarItem icon={CheckCircle} label="Verification Status" path="/dashboard/company/verification" />
                                <SidebarItem icon={Building} label="Company Profile" path="/dashboard/company/profile" />
                            </>
                        )}

                        {user.role === 'admin' && (
                            <>
                                {(user.adminType === 'super_admin' || user.adminType === 'announcement_admin') && (
                                    <SidebarItem icon={Bell} label="Manage Announcements" path="/dashboard/admin/announcements" />
                                )}
                                {user.adminType === 'super_admin' && (
                                    <>
                                        <SidebarItem icon={CheckCircle} label="Verify Companies" path="/dashboard/admin/companies" />
                                        <SidebarItem icon={CheckCircle} label="Verify Students" path="/dashboard/admin/students/verify" />
                                    </>
                                )}
                                {(user.adminType === 'super_admin' || user.adminType === 'student_admin') && (
                                    <SidebarItem icon={CalendarIcon} label="Manage Calendar" path="/dashboard/admin/calendar" />
                                )}
                                <SidebarItem icon={Settings} label="Assign Powers" path="/dashboard/admin/assign-powers" />
                            </>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 relative">
                    <div className="max-w-6xl mx-auto h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
