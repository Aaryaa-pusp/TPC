import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Check, X, FileText, User } from 'lucide-react';

export default function StudentVerificationQueue() {
    const { token } = useAuth();
    const [pendingStudents, setPendingStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingStudents();
    }, []);

    const fetchPendingStudents = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('http://localhost:5000/api/admin/students/pending', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPendingStudents(data.pendingStudents);
            if (data.pendingStudents.length > 0 && !selectedStudent) {
                setSelectedStudent(data.pendingStudents[0]);
            }
        } catch (err) {
            console.error('Failed to fetch pending students:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleVerification = async (studentId, status) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/students/${studentId}/verify`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Remove from list
            const updatedList = pendingStudents.filter(s => s._id !== studentId);
            setPendingStudents(updatedList);

            // Auto-select next
            if (updatedList.length > 0) {
                setSelectedStudent(updatedList[0]);
            } else {
                setSelectedStudent(null);
            }

        } catch (err) {
            console.error(`Failed to mark student as ${status}:`, err);
            alert(`Failed to ${status} student.`);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading queue...</div>;

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-[fade-in-up_0.4s_ease-out]">
            {/* Left Pane: Queue List */}
            <div className="w-1/3 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800">Verification Queue</h2>
                    <p className="text-xs font-semibold text-slate-500 mt-1">{pendingStudents.length} pending requests</p>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                    {pendingStudents.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 font-medium text-sm">
                            Queue is empty.
                        </div>
                    ) : (
                        pendingStudents.map(student => (
                            <div
                                key={student._id}
                                onClick={() => setSelectedStudent(student)}
                                className={`p-4 rounded-xl cursor-pointer border transition-all ${selectedStudent?._id === student._id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-100 hover:border-blue-200 hover:bg-slate-50'}`}
                            >
                                <div className="font-bold text-slate-800 flex items-center justify-between">
                                    <span>{student.fullName || student.name || 'Unknown'}</span>
                                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono">{student.rollNumber}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1 font-medium">
                                    {student.program} • {student.department}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Pane: Review Details */}
            <div className="w-2/3 bg-white rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col overflow-hidden">
                {selectedStudent ? (
                    <>
                        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{selectedStudent.fullName || selectedStudent.name}</h2>
                                <p className="text-slate-500 font-medium mt-1">{selectedStudent.email}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => handleVerification(selectedStudent._id, 'verified')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2">
                                    <Check size={16} /> Approve
                                </button>
                                <button onClick={() => handleVerification(selectedStudent._id, 'rejected')} className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                                    <X size={16} /> Discard
                                </button>
                            </div>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto">
                            <div className="grid grid-cols-2 gap-6 mb-8">
                                <InfoCard label="Roll Number" value={selectedStudent.rollNumber} icon={<User size={16} className="text-blue-500" />} />
                                <InfoCard label="Program & Branch" value={`${selectedStudent.program} - ${selectedStudent.department}`} icon={<FileText size={16} className="text-purple-500" />} />
                                <InfoCard label="Graduation Year" value={selectedStudent.graduationYear || 'N/A'} />
                                <InfoCard label="CGPA" value={selectedStudent.cgpa ? selectedStudent.cgpa.toFixed(2) : 'N/A'} />
                                <InfoCard label="Phone" value={selectedStudent.phoneNumber || 'N/A'} />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Institute ID Card</h3>
                                <div className="border rounded-xl bg-slate-100 flex items-center justify-center p-2 min-h-[300px]">
                                    {selectedStudent.idCardUrl ? (
                                        <img src={selectedStudent.idCardUrl} alt="ID Card" className="max-w-full max-h-[500px] object-contain rounded-lg shadow-sm" />
                                    ) : (
                                        <p className="text-slate-400 font-medium">No ID card uploaded.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <FileText size={64} className="mb-4 text-slate-200" />
                        <p className="font-semibold text-lg">Select a student from the queue</p>
                        <p className="text-sm">Their verification details and ID card will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function InfoCard({ label, value, icon }) {
    return (
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                {icon} {label}
            </p>
            <p className="font-semibold text-slate-800">{value}</p>
        </div>
    );
}
