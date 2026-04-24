import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { UserCircle, LogOut, Bell, Building, CheckCircle, Database, Calendar as CalendarIcon, FileText, Settings, ShieldAlert, LayoutDashboard, House, ClipboardList } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import logo from '../assets/logo.png';

export default function DashboardShell() {
    const { user, logout, token } = useAuth();
    const navigate = useNavigate();

    const location = useLocation();

    // localStorage helpers keyed by userId so multiple users share the same browser safely
    const lsKey = (key) => `${key}_${user?._id || user?.userId || 'u'}`;
    const getSeenTs = (key) => Number(localStorage.getItem(lsKey(key)) || '0');
    const setSeenTs = (key) => localStorage.setItem(lsKey(key), String(Date.now()));

    const [adminStats, setAdminStats] = useState({
        pendingCompanies: 0, pendingStudents: 0,
        needsDateAllocation: 0, needsFinalVerification: 0, totalAnnouncements: 0,
    });
    const [companyStats, setCompanyStats] = useState({ pendingApproval: 0 });
    const [studentStats, setStudentStats] = useState({ newApplicationUpdates: 0, newAnnouncements: 0 });
    const [refetchTrigger, setRefetchTrigger] = useState(0);

    const fetchStats = () => {
        if (!user || !token) return;
        const headers = { Authorization: `Bearer ${token}` };
        if (user.role === 'admin') {
            api.get('/api/admin/dashboard-stats', { headers })
                .then(res => setAdminStats(res.data))
                .catch(err => console.error('Failed to fetch admin stats', err));
        } else if (user.role === 'company') {
            api.get('/api/company/stats', { headers })
                .then(res => setCompanyStats(res.data))
                .catch(err => console.error('Failed to fetch company stats', err));
        } else if (user.role === 'student') {
            const params = new URLSearchParams({
                lastSeenApplicationsAt: getSeenTs('lastSeenApplicationsAt'),
                lastSeenAnnouncementsAt: getSeenTs('lastSeenAnnouncementsAt'),
            });
            api.get(`/api/student/stats?${params}`, { headers })
                .then(res => setStudentStats(res.data))
                .catch(err => console.error('Failed to fetch student stats', err));
        }
    };

    useEffect(() => { fetchStats(); }, [user, token, refetchTrigger]);

    // Clear relevant badge when any role navigates to a badged section
    useEffect(() => {
        const p = location.pathname;

        if (user?.role === 'student') {
            if (p.includes('/announcements')) {
                setSeenTs('lastSeenAnnouncementsAt');
                setStudentStats(prev => ({ ...prev, newAnnouncements: 0 }));
            }
            if (p.includes('/applications')) {
                setSeenTs('lastSeenApplicationsAt');
                setStudentStats(prev => ({ ...prev, newApplicationUpdates: 0 }));
            }
        }

        if (user?.role === 'admin') {
            if (p.includes('/companies'))         setAdminStats(prev => ({ ...prev, pendingCompanies: 0 }));
            if (p.includes('/students/verify'))   setAdminStats(prev => ({ ...prev, pendingStudents: 0 }));
            if (p.includes('/event-workflows'))   setAdminStats(prev => ({ ...prev, needsDateAllocation: 0, needsFinalVerification: 0 }));
        }

        if (user?.role === 'company') {
            if (p.includes('/events'))            setCompanyStats(prev => ({ ...prev, pendingApproval: 0 }));
        }
    }, [location.pathname]);

    const refetchAdminStats = () => setRefetchTrigger(t => t + 1);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Prevent access to other roles' dashboards by enforcing namespace prefix
    const pathname = window.location.pathname;
    const allowedPrefix = `/dashboard/${user.role}`;

    if (pathname === '/dashboard' || pathname === '/dashboard/' || !pathname.startsWith(allowedPrefix)) {
        return <Navigate to={allowedPrefix} replace />;
    }

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarItem = ({ icon: Icon, label, path, disabled, badgeCount }) => {
        const isDashboardHome = path === `/dashboard/${user.role}`;
        const isActive = isDashboardHome
            ? window.location.pathname === path || window.location.pathname === `${path}/`
            : window.location.pathname.includes(path);
        return (
            <button
                disabled={disabled}
                onClick={() => { if (!disabled && path) navigate(path); }}
                className={`w-full flex items-center gap-3 px-4 py-3 mb-1 rounded-xl text-sm font-semibold transition-all duration-200 ${disabled
                    ? 'bg-gray-50 text-gray-400 cursor-not-allowed border border-gray-100 dark:bg-slate-800/60 dark:text-slate-500 dark:border-slate-700'
                    : isActive ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800' : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:shadow-sm group dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-200'
                    }`}
            >
                <Icon className={`w-5 h-5 ${disabled ? 'text-gray-400 dark:text-slate-500' : isActive ? 'text-blue-600 dark:text-blue-300' : 'text-slate-400 group-hover:text-blue-600 transition-colors dark:text-slate-500 dark:group-hover:text-blue-300'}`} />
                <span>{label}</span>
                {badgeCount > 0 && !disabled && (
                    <span style={{
                        marginLeft: 'auto',
                        minWidth: '20px',
                        height: '20px',
                        borderRadius: '9999px',
                        backgroundColor: '#dc2626',
                        color: '#fff',
                        fontSize: '11px',
                        fontWeight: 900,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 5px',
                        lineHeight: 1,
                        flexShrink: 0,
                    }}>
                        {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                )}
                {disabled && <ShieldAlert className="w-4 h-4 ml-auto text-yellow-500" title="Verification Pending" />}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans dark:bg-slate-950">
            {/* Top Navbar */}
            <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm shadow-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:shadow-slate-950/30">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-md p-1 flex items-center justify-center shadow-sm ring-1 ring-blue-100 dark:bg-slate-900 dark:ring-slate-700">
                        <img src={logo} alt="IIT Patna logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="font-bold text-slate-800 hidden sm:block dark:text-slate-100">IIT Patna Portal</span>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        <House size={16} />
                        <span className="hidden sm:block">Home</span>
                    </Link>
                    <span className="text-sm font-medium text-slate-500 hidden md:block bg-slate-100 px-3 py-1 rounded-full border border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Access
                    </span>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:text-slate-300 dark:hover:bg-red-950/40">
                        <LogOut size={16} />
                        <span className="hidden sm:block">Sign out</span>
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-30 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.05)] dark:bg-slate-900 dark:border-slate-800">
                    {/* Profile Widget */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col items-center">
                            <div
                                className="relative group cursor-pointer mb-4"
                                onClick={() => navigate(`/dashboard/${user.role}/profile`)}
                                title="Edit Profile"
                            >
                                <div className="w-20 h-20 bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full flex items-center justify-center shadow-inner border-4 border-white ring-1 ring-slate-200 overflow-hidden dark:from-slate-800 dark:to-slate-700 dark:ring-slate-600 dark:border-slate-800">
                                    {user.profilePicture ? (
                                        <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserCircle size={40} strokeWidth={1} className="text-blue-400" />
                                    )}
                                </div>
                                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-white text-xs font-medium">Edit</span>
                                </div>
                            </div>
                            <h3 className="font-bold text-slate-900 drop-shadow-sm dark:text-slate-100">{user.email ? user.email.split('@')[0] : 'User'}</h3>
                            <p className="text-xs font-semibold text-blue-600 mt-1 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300">
                                {user.role}
                            </p>
                        </div>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-4 dark:text-slate-500">Menu</div>

                        <SidebarItem icon={LayoutDashboard} label="Dashboard Home" path={`/dashboard/${user.role}`} />

                        {user.role === 'student' && (
                            <>
                                <SidebarItem
                                    icon={Bell}
                                    label="Announcements"
                                    path="/dashboard/student/announcements"
                                    disabled={user.verificationStatus === 'pending' || user.verificationStatus === 'unsubmitted'}
                                    badgeCount={studentStats.newAnnouncements}
                                />
                                <SidebarItem
                                    icon={CalendarIcon}
                                    label="Calendar & Events"
                                    path="/dashboard/student/calendar"
                                    disabled={user.verificationStatus === 'pending' || user.verificationStatus === 'unsubmitted'}
                                />
                                <SidebarItem
                                    icon={FileText}
                                    label="My Resumes"
                                    path="/dashboard/student/resumes"
                                    disabled={user.verificationStatus === 'pending' || user.verificationStatus === 'unsubmitted'}
                                />
                                <SidebarItem
                                    icon={ClipboardList}
                                    label="My Applications"
                                    path="/dashboard/student/applications"
                                    disabled={user.verificationStatus === 'pending' || user.verificationStatus === 'unsubmitted'}
                                    badgeCount={studentStats.newApplicationUpdates}
                                />
                                <SidebarItem
                                    icon={CheckCircle}
                                    label="Verify Yourself"
                                    path="/dashboard/student/verify"
                                />
                            </>
                        )}

                        {user.role === 'company' && (
                            <>
                                <SidebarItem
                                    icon={Database}
                                    label="Student Database"
                                    path="/dashboard/company/database"
                                    disabled={user.verificationStatus === 'pending' || user.verificationStatus === 'unsubmitted'}
                                />
                                <SidebarItem
                                    icon={CalendarIcon}
                                    label="Manage Events"
                                    path="/dashboard/company/events"
                                    badgeCount={companyStats.pendingApproval}
                                />
                                <SidebarItem icon={CheckCircle} label="Verification Status" path="/dashboard/company/verify" />
                                <SidebarItem icon={Building} label="Company Profile" path="/dashboard/company/profile" />
                            </>
                        )}

                        {user.role === 'admin' && (
                            <>
                                {(user.adminType === 'super_admin' || user.adminType === 'announcement_admin') && (
                                    <SidebarItem
                                        icon={Bell}
                                        label="Manage Announcements"
                                        path="/dashboard/admin/announcements"
                                    />
                                )}
                                {user.adminType === 'super_admin' && (
                                    <>
                                        <SidebarItem icon={CheckCircle} label="Verify Companies" path="/dashboard/admin/companies" badgeCount={adminStats.pendingCompanies} />
                                        <SidebarItem icon={CheckCircle} label="Verify Students" path="/dashboard/admin/students/verify" badgeCount={adminStats.pendingStudents} />
                                    </>
                                )}
                                {(user.adminType === 'super_admin' || user.adminType === 'student_admin') && (
                                    <SidebarItem icon={CalendarIcon} label="Manage Calendar" path="/dashboard/admin/calendar" />
                                )}
                                <SidebarItem 
                                    icon={ClipboardList} 
                                    label="Event Workflows" 
                                    path="/dashboard/admin/event-workflows" 
                                    badgeCount={user.adminType === 'super_admin' ? (adminStats.needsDateAllocation + adminStats.needsFinalVerification) : (user.adminType === 'announcement_admin' ? adminStats.needsDateAllocation : (user.adminType === 'student_admin' ? adminStats.needsFinalVerification : 0))}
                                />
                                <SidebarItem icon={Settings} label="Assign Powers" path="/dashboard/admin/assign-powers" />
                            </>
                        )}
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 relative dark:bg-slate-950">
                    <div className="max-w-6xl mx-auto h-full">
                        <Outlet context={{ adminStats, refetchAdminStats }} />
                    </div>
                </main>
            </div>
        </div>
    );
}
