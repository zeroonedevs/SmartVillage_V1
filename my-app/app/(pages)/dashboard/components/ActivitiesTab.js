
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ActivitiesTab = () => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        date: '',
        studentsParticipated: '',
    });

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const response = await fetch('/api/dashboard/viewactivities');
            if (response.status === 401) {
                router.push('/GOP/Login');
                return;
            }
            const data = await response.json();
            if (data.success) {
                setActivities(data.data);
            } else {
                throw new Error(data.error || 'Failed to fetch activities');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Check file type - only PDF allowed
            if (file.type !== 'application/pdf') {
                alert('Only PDF files are allowed. Please select a PDF file.');
                e.target.value = ''; // Reset input
                setSelectedFile(null);
                return;
            }
            
            // Check file size - max 3MB
            if (file.size > 3 * 1024 * 1024) {
                alert('File size exceeds 3MB. Please choose a smaller file.');
                e.target.value = ''; // Reset input
                setSelectedFile(null);
                return;
            }
            
            setSelectedFile(file);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this activity?')) return;
        setDeletingId(id);
        try {
            const res = await fetch('/api/dashboard/viewactivities', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            const data = await res.json();
            if (data.success) {
                setActivities(activities.filter(a => a._id !== id));
            } else {
                alert(data.message || 'Failed to delete');
            }
        } catch (err) {
            alert('Error deleting activity');
        } finally {
            setDeletingId(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError(null);

        try {
            let fileUrl = '';

            // 1. Upload Report if selected
            if (selectedFile) {
                const formData = new FormData();
                formData.append('file', selectedFile);
                formData.append('folder', 'reports');

                const uploadRes = await fetch('/api/dashboard/upload', {
                    method: 'POST',
                    body: formData,
                });

                const uploadData = await uploadRes.json();
                 if (!uploadRes.ok) {
                    throw new Error(uploadData.error || 'Report upload failed');
                }
                fileUrl = uploadData.fileUrl;
            } else {
                throw new Error("Report file is required");
            }

            // 2. Save Activity Metadata
            const saveRes = await fetch('/api/dashboard/uploadactivities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    reportLink: fileUrl
                }),
            });

            const saveData = await saveRes.json();
            if (saveData.success) {
                setActivities([saveData.data, ...activities]);
                setFormData({ name: '', date: '', studentsParticipated: '' });
                setSelectedFile(null);
                document.getElementById('report-upload').value = '';
                alert('Activity added successfully!');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to save activity. ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Add Activity Form */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-50 rounded-lg text-green-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Add New Activity Report</h3>
                        <p className="text-sm text-gray-500">Document events and upload reports</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Activity Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:bg-white focus:border-green-500 focus:ring-green-500 border transition-colors"
                                placeholder="e.g. Village Health Camp"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({...formData, date: e.target.value})}
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:bg-white focus:border-green-500 focus:ring-green-500 border transition-colors"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Students Participated</label>
                            <input
                                type="number"
                                value={formData.studentsParticipated}
                                onChange={(e) => setFormData({...formData, studentsParticipated: e.target.value})}
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:bg-white focus:border-green-500 focus:ring-green-500 border transition-colors"
                                placeholder="0"
                                required
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Report File (PDF only, Max 3MB)</label>
                            <div className="flex items-center justify-center w-full">
                                <label htmlFor="report-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-green-400 transition-all">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        {selectedFile ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mb-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-700 font-semibold">{selectedFile.name}</p>
                                                <p className="text-xs text-gray-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                            </>
                                        ) : (
                                            <>
                    <svg className="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-green-600">Click to upload PDF report</span></p>
                                                <p className="text-xs text-gray-400">PDF files only, maximum 3MB</p>
                                            </>
                                        )}
                                    </div>
                                    <input id="report-upload" type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} required />
                                </label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={uploading}
                            className={`w-full md:w-auto md:min-w-[200px] flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-md text-sm font-bold text-white transition-all transform hover:-translate-y-0.5 mx-auto md:mx-0 ${
                                uploading 
                                ? 'bg-gray-400 cursor-not-allowed shadow-none' 
                                : 'bg-green-600 hover:bg-green-700 hover:shadow-green-200'
                            }`}
                        >
                            {uploading ? 'Uploading...' : 'Submit Activity'}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 text-center bg-red-50 py-2 rounded">{error}</p>}
                </form>
            </div>

            {/* Activities List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">Activity Reports</h3>
                        <p className="text-sm text-gray-500">History of all activities</p>
                    </div>
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                        Total: {activities.length}
                    </span>
                </div>
                {loading ? (
                    <div className="p-12 text-center text-gray-500">Loading activities...</div>
                ) : activities.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No activities reported yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Participation</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Report</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {activities.map((activity) => (
                                    <tr key={activity._id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                            {new Date(activity.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{activity.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">{activity.studentsParticipated} Students</td>
                                        <td className="px-6 py-4 text-sm">
                                            <a 
                                                href={activity.reportLink} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 font-medium hover:underline"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                </svg>
                                                View Report
                                            </a>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleDelete(activity._id)}
                                                disabled={deletingId === activity._id}
                                                className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Activity"
                                            >
                                                {deletingId === activity._id ? (
                                                    <span className="text-xs">Processing...</span>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActivitiesTab;
