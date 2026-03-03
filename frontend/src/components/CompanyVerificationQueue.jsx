import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, X, Check, Building2, User, Globe, Mail, Phone } from 'lucide-react';

export default function CompanyVerificationQueue() {
    const { token, user } = useAuth();
    const [pendingCompanies, setPendingCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user && user.adminType === 'super_admin') {
            fetchPendingCompanies();
        }
    }, [user]);

    const fetchPendingCompanies = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('http://localhost:5000/api/admin/companies/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingCompanies(data.companies);
            if (data.companies.length > 0 && !selectedCompany) {
                setSelectedCompany(data.companies[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (companyId, status) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/companies/${companyId}/verify`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Remove from list
            const updatedList = pendingCompanies.filter(c => c._id !== companyId);
            setPendingCompanies(updatedList);

            // Auto-select next
            if (updatedList.length > 0) {
                setSelectedCompany(updatedList[0]);
            } else {
                setSelectedCompany(null);
            }

        } catch (err) {
            console.error(`Failed to mark company as ${status}:`, err);
            alert(`Failed to ${status} company.`);
        }
    };

    if (user?.adminType !== 'super_admin') {
        return <div className="p-8 text-center text-red-500 font-bold dark:text-red-300">Unauthorized. Super Admin access required.</div>;
    }

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium dark:text-slate-400">Loading queue...</div>;

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-[fade-in-up_0.4s_ease-out]">
            {/* Left Pane: Queue List */}
            <div className="w-1/3 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden dark:bg-slate-900/90 dark:border-slate-700/70 dark:shadow-[0_18px_36px_-20px_rgba(2,6,23,0.9)]">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/70">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 dark:text-slate-100"><Building2 className="text-blue-500 dark:text-blue-400" size={20} /> Verification Queue</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1 dark:text-slate-400">{pendingCompanies.length} pending requests</p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {pendingCompanies.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-10 text-slate-400 dark:text-slate-500">
                            <ShieldCheck size={48} className="text-emerald-400 dark:text-emerald-300 mb-4 opacity-50" />
                            <p className="font-semibold text-slate-500 text-sm dark:text-slate-400">All caught up!</p>
                        </div>
                    ) : (
                        pendingCompanies.map(company => (
                            <div
                                key={company._id}
                                onClick={() => setSelectedCompany(company)}
                                className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedCompany?._id === company._id ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-600 dark:bg-blue-950/40' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:border-blue-500/40 dark:hover:bg-slate-800/80'}`}
                            >
                                <div className="font-bold text-slate-800 flex items-center justify-between dark:text-slate-100">
                                    <span>{company.companyName || 'Unknown Company'}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1 font-medium truncate dark:text-slate-400">
                                    {company.companyEmail}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Pane: Review Details */}
            <div className="w-2/3 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden dark:bg-slate-900/90 dark:border-slate-700/70 dark:shadow-[0_18px_36px_-20px_rgba(2,6,23,0.9)]">
                {selectedCompany ? (
                    <>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/30 dark:border-slate-700 dark:bg-slate-800/60">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedCompany.companyName}</h2>
                                <p className="text-slate-500 font-medium mt-1 flex items-center gap-1 dark:text-slate-400"><Mail size={14} /> {selectedCompany.companyEmail}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => handleVerification(selectedCompany._id, 'verified')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2 dark:bg-emerald-500 dark:hover:bg-emerald-400">
                                    <Check size={16} /> Approve
                                </button>
                                <button onClick={() => handleVerification(selectedCompany._id, 'rejected')} className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/60">
                                    <X size={16} /> Discard
                                </button>
                            </div>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <InfoCard label="Website" value={selectedCompany.companyWebsite || 'N/A'} icon={<Globe size={16} className="text-blue-500" />} />
                                <InfoCard label="Contact Number" value={selectedCompany.contactNumber || 'N/A'} icon={<Phone size={16} className="text-purple-500" />} />
                                <InfoCard label="HR Contact Name" value={selectedCompany.HRContactName || 'N/A'} icon={<User size={16} className="text-slate-500" />} />
                                <InfoCard label="HR Contact Email" value={selectedCompany.HRContactEmail || 'N/A'} icon={<Mail size={16} className="text-slate-500" />} />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider dark:text-slate-300">Account Information</h3>
                                <div className="border border-slate-200 rounded-xl bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/80">
                                    <p className="text-sm text-slate-600 mb-2 dark:text-slate-300"><span className="font-bold text-slate-800 dark:text-slate-100">Account ID:</span> {selectedCompany._id}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-300"><span className="font-bold text-slate-800 dark:text-slate-100">Login Email:</span> {selectedCompany.email}</p>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
                        <Building2 size={64} className="mb-4 text-slate-200 dark:text-slate-700" />
                        <p className="font-semibold text-lg dark:text-slate-300">Select a company from the queue</p>
                        <p className="text-sm dark:text-slate-400">Their verification details will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoCard({ label, value, icon }) {
    return (
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl dark:bg-slate-800/80 dark:border-slate-700">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2 dark:text-slate-500">
                {icon} {label}
            </p>
            <p className="font-semibold text-slate-800 break-words dark:text-slate-100">{value}</p>
        </div>
    );
}
