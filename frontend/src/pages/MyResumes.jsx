import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, UploadCloud, Loader2, ExternalLink, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';

export default function MyResumes() {
    const { user, token } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (res.ok) {
                    setProfile(data.user);
                } else {
                    setError('Failed to load profile data.');
                }
            } catch (err) {
                setError('Error connecting to Server.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [token]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setResumeFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!resumeFile) return;

        setUploading(true);
        setMessage('');
        setError('');

        try {
            const formData = new FormData();
            formData.append('resume', resumeFile);

            const res = await fetch('http://localhost:5000/api/student/profile', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setMessage('Resume uploaded successfully!');
                setProfile(data.student);
                setResumeFile(null); // Clear selected file

                // Clear the file input visually
                const fileInput = document.getElementById('resume-upload');
                if (fileInput) fileInput.value = '';

            } else {
                setError(data.message || 'Error uploading resume.');
            }
        } catch (err) {
            setError('Server connection error during upload.');
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return <div className="text-red-500 min-h-[50vh] flex items-center justify-center">Profile data could not be loaded.</div>;
    }

    const isVerified = profile.verificationStatus === 'verified';
    const hasResume = !!profile.resumeLink;

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">

            {/* Column 1: Main Resume Management (70% width on large screens) */}
            <div className="w-full lg:w-8/12 space-y-6">

                {/* Header */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">My Resumes</h1>
                        <p className="text-slate-500 mt-1">Manage your active resume for placement and internship drives.</p>
                    </div>
                    <div className="hidden sm:flex w-12 h-12 bg-blue-50 rounded-full items-center justify-center text-blue-600">
                        <FileText size={24} />
                    </div>
                </div>

                {!isVerified && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 px-5 py-4 rounded-xl flex items-start gap-4">
                        <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
                        <div>
                            <h3 className="font-semibold">Account Pending Verification</h3>
                            <p className="text-sm mt-1">
                                You cannot upload a new resume until your account is verified by the TPC.
                                However, you can view your currently stored resume if one exists.
                            </p>
                        </div>
                    </div>
                )}

                {message && <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> {message}</div>}
                {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">{error}</div>}

                {/* Status Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <CheckCircle2 className={`w-5 h-5 ${hasResume ? 'text-green-500' : 'text-slate-300'}`} />
                        Current Active Resume
                    </h2>

                    {hasResume ? (
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-800">{profile.fullName}_Resume.pdf</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Uploaded securely via Cloudinary</p>
                                </div>
                            </div>
                            <a
                                href={profile.resumeLink}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-blue-600 px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                            >
                                <ExternalLink size={18} />
                                View Resume
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 px-4 bg-slate-50 border border-slate-100 border-dashed rounded-xl">
                            <FileText className="w-12 h-12 text-slate-300 mb-3" />
                            <p className="text-slate-500 font-medium text-center">No resume uploaded yet.</p>
                            <p className="text-xs text-slate-400 mt-1 text-center">Upload one below to make it available to recruiters.</p>
                        </div>
                    )}
                </div>

                {/* Upload Area */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">
                        {hasResume ? 'Replace Resume' : 'Upload Resume'}
                    </h2>

                    <form onSubmit={handleUpload}>
                        <div className={`flex justify-center px-6 pt-8 pb-10 border-2 border-dashed rounded-xl transition-colors ${!isVerified ? 'bg-slate-50 border-slate-200 opacity-70' : 'border-blue-200 hover:border-blue-400 bg-blue-50/20'}`}>
                            <div className="space-y-2 text-center flex flex-col items-center w-full">
                                <UploadCloud className={`mx-auto h-12 w-12 ${!isVerified ? 'text-slate-400' : 'text-blue-500'}`} />
                                <div className="flex flex-col sm:flex-row items-center text-sm text-slate-600 gap-1.5 mt-2">
                                    <label htmlFor="resume-upload" className={`relative cursor-pointer rounded-md font-semibold focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 ${!isVerified ? 'text-slate-500 pointer-events-none' : 'text-blue-600 hover:text-blue-700'}`}>
                                        <span className="bg-white px-3 py-1 border border-blue-200 rounded-lg shadow-sm">Browse Files</span>
                                        <input id="resume-upload" name="resume" type="file" className="sr-only" onChange={handleFileChange} disabled={!isVerified} accept=".pdf,.doc,.docx" />
                                    </label>
                                    <p className="text-slate-500 mt-2 sm:mt-0">or drag and drop here</p>
                                </div>
                                <p className="text-xs text-slate-500 font-medium pt-2">Accepts PDF, DOC, DOCX up to 5MB</p>

                                {resumeFile && (
                                    <div className="mt-6 w-full max-w-sm p-4 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
                                        <div className="flex flex-col items-start truncate overflow-hidden">
                                            <span className="text-sm font-semibold text-slate-800 truncate w-full text-left">{resumeFile.name}</span>
                                            <span className="text-xs text-slate-500">{(resumeFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={!isVerified || !resumeFile || uploading}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${!isVerified || !resumeFile || uploading
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98]'
                                    }`}
                            >
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
                                <span>{uploading ? 'Uploading to Secure Vault...' : 'Confirm Upload'}</span>
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            {/* Column 2: Helper Links & Resources (30% width on large screens) */}
            <div className="w-full lg:w-4/12 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden sticky top-24">
                    <div className="bg-blue-600 p-5">
                        <h3 className="font-bold text-white text-lg">TPC Resume Resources</h3>
                        <p className="text-blue-100 text-sm mt-1">Tools and guides to help you stand out to top recruiters.</p>
                    </div>

                    <div className="p-2">
                        <ResourceLink
                            title="Standard IITP Resume Templates"
                            description="Download official Word & LaTeX formats."
                            url="#"
                        />
                        <ResourceLink
                            title="Action Verbs Guide"
                            description="A curated list of strong verbs to start your bullet points."
                            url="#"
                        />
                        <ResourceLink
                            title="Check your ATS Score"
                            description="Test how easily readable your PDF is by automated parsers."
                            url="#"
                        />
                        <ResourceLink
                            title="Placement Guidelines"
                            description="Read the official TPC policies for the current session."
                            url="#"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
}

// Helper component for side links
const ResourceLink = ({ title, description, url }) => {
    return (
        <a
            href={url}
            className="flex items-start gap-3 p-4 hover:bg-slate-50 rounded-xl transition-colors group border-b border-transparent hover:border-slate-100"
        >
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0 mt-0.5">
                <FileText size={18} />
            </div>
            <div>
                <h4 className="font-semibold text-slate-800 text-sm group-hover:text-blue-600 transition-colors flex items-center gap-1">
                    {title}
                    <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-5px] group-hover:translate-x-0" />
                </h4>
                <p className="text-xs text-slate-500 mt-1">{description}</p>
            </div>
        </a>
    );
};
