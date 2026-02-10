"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const NewsTab = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [migrating, setMigrating] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        title: '',
        date: '',
        excerpt: '',
        link: ''
    });

    useEffect(() => {
        fetchNews();
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('/api/news');
            if (response.status === 401) {
                router.push('/login');
                return;
            }
            if (!response.ok) throw new Error('Failed to fetch news');
            const data = await response.json();
            if (data.success) {
                setNews(data.data);
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
            if (!file.type.startsWith('image/')) {
                alert('Only image files are allowed.');
                e.target.value = '';
                setSelectedFile(null);
                return;
            }
            if (file.size > 4 * 1024 * 1024) {
                alert('File size exceeds 4MB. Please choose a smaller file.');
                e.target.value = '';
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Format date input to DD-MM-YYYY
        if (name === 'date') {
            // Remove any non-digit characters
            let formattedValue = value.replace(/\D/g, '');
            
            // Add dashes in the right places
            if (formattedValue.length > 2) {
                formattedValue = formattedValue.substring(0, 2) + '-' + formattedValue.substring(2);
            }
            if (formattedValue.length > 5) {
                formattedValue = formattedValue.substring(0, 5) + '-' + formattedValue.substring(5, 9);
            }
            
            // Limit to DD-MM-YYYY format (10 characters)
            if (formattedValue.length <= 10) {
                setFormData({ ...formData, [name]: formattedValue });
            }
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);
        setError(null);

        // Validate date format
        const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
        if (formData.date && !datePattern.test(formData.date)) {
            setError('Please enter date in DD-MM-YYYY format (e.g., 10-08-2024)');
            setUploading(false);
            return;
        }

        // Validate date values
        if (formData.date) {
            const [day, month, year] = formData.date.split('-');
            const dayNum = parseInt(day, 10);
            const monthNum = parseInt(month, 10);
            const yearNum = parseInt(year, 10);
            
            if (dayNum < 1 || dayNum > 31 || monthNum < 1 || monthNum > 12 || yearNum < 2000 || yearNum > 2100) {
                setError('Please enter a valid date (DD: 01-31, MM: 01-12, YYYY: 2000-2100)');
                setUploading(false);
                return;
            }
        }

        try {
            let imageUrl = '';

            // Upload image if selected
            if (selectedFile || editingNews) {
                if (selectedFile) {
                    const formDataUpload = new FormData();
                    formDataUpload.append('file', selectedFile);
                    formDataUpload.append('folder', 'news');

                    const uploadRes = await fetch('/api/dashboard/upload', {
                        method: 'POST',
                        body: formDataUpload,
                    });

                    const uploadData = await uploadRes.json();
                    if (!uploadRes.ok) {
                        throw new Error(uploadData.error || 'Image upload failed');
                    }
                    imageUrl = uploadData.fileUrl;
                } else {
                    // Use existing image URL when editing
                    imageUrl = editingNews.imageUrl;
                }
            } else {
                throw new Error("Image is required");
            }

            // Save news article
            const url = editingNews ? `/api/news/${editingNews._id}` : '/api/news';
            const method = editingNews ? 'PUT' : 'POST';

            const saveRes = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    imageUrl
                }),
            });

            const saveData = await saveRes.json();
            if (saveData.success) {
                if (editingNews) {
                    setNews(news.map(n => n._id === editingNews._id ? saveData.data : n));
                } else {
                    setNews([saveData.data, ...news]);
                }
                setFormData({ title: '', date: '', excerpt: '', link: '' });
                setSelectedFile(null);
                setEditingNews(null);
                setShowCreateForm(false);
                document.getElementById('news-image-upload').value = '';
                alert(editingNews ? 'News article updated successfully!' : 'News article added successfully!');
            } else {
                throw new Error(saveData.error || 'Failed to save news article');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to save news article. ' + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this news article?')) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/news/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                setNews(news.filter(n => n._id !== id));
            } else {
                alert(data.error || 'Failed to delete');
            }
        } catch (err) {
            alert('Error deleting news article');
        } finally {
            setDeletingId(null);
        }
    };

    const startEdit = (newsItem) => {
        setEditingNews(newsItem);
        setFormData({
            title: newsItem.title,
            date: newsItem.date,
            excerpt: newsItem.excerpt,
            link: newsItem.link || ''
        });
        setSelectedFile(null);
        setShowCreateForm(true);
    };

    const cancelForm = () => {
        setShowCreateForm(false);
        setEditingNews(null);
        setFormData({ title: '', date: '', excerpt: '', link: '' });
        setSelectedFile(null);
        setError(null);
        document.getElementById('news-image-upload').value = '';
    };

    const handleImportExisting = async () => {
        if (!confirm('This will import all existing news articles from the static files. Continue?')) {
            return;
        }

        setMigrating(true);
        setError(null);

        try {
            const response = await fetch('/api/migrate/import-news', {
                method: 'POST',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(`Migration completed!\nImported: ${data.imported}\nSkipped (already exists): ${data.skipped}\nTotal: ${data.total}`);
                // Refresh the news list
                fetchNews();
            } else {
                setError(data.error || 'Failed to import existing news');
            }
        } catch (err) {
            setError('Failed to import existing news. ' + err.message);
        } finally {
            setMigrating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Create/Edit News Form */}
            {showCreateForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-800">
                            {editingNews ? 'Edit News Article' : 'Add New News Article'}
                        </h3>
                        <button
                            onClick={cancelForm}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:bg-white focus:border-green-500 focus:ring-green-500 border transition-colors"
                                    placeholder="Enter news title"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Date (DD-MM-YYYY)</label>
                                <input
                                    type="text"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    onBlur={(e) => {
                                        // Validate date format on blur
                                        const datePattern = /^(\d{2})-(\d{2})-(\d{4})$/;
                                        if (e.target.value && !datePattern.test(e.target.value)) {
                                            // Try to fix common mistakes
                                            const parts = e.target.value.split('-');
                                            if (parts.length === 3) {
                                                const day = parts[0].padStart(2, '0');
                                                const month = parts[1].padStart(2, '0');
                                                const year = parts[2].length === 2 ? '20' + parts[2] : parts[2];
                                                if (day.length === 2 && month.length === 2 && year.length === 4) {
                                                    setFormData({ ...formData, date: `${day}-${month}-${year}` });
                                                }
                                            }
                                        }
                                    }}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:bg-white focus:border-green-500 focus:ring-green-500 border transition-colors"
                                    placeholder="e.g., 10-08-2024"
                                    maxLength={10}
                                    pattern="\d{2}-\d{2}-\d{4}"
                                    required
                                />
                                <p className="text-xs text-gray-500 mt-1">Format: DD-MM-YYYY (e.g., 10-08-2024)</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                <textarea
                                    name="excerpt"
                                    value={formData.excerpt}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:bg-white focus:border-green-500 focus:ring-green-500 border transition-colors"
                                    placeholder="Enter news description"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Article Link (Optional)</label>
                                <input
                                    type="url"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 p-2.5 text-sm focus:bg-white focus:border-green-500 focus:ring-green-500 border transition-colors"
                                    placeholder="https://example.com/article"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image (Max 4MB)</label>
                                <div className="flex items-center justify-center w-full">
                                    <label htmlFor="news-image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 hover:border-green-400 transition-all">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {selectedFile ? (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mb-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-700 font-semibold">{selectedFile.name}</p>
                                                </>
                                            ) : editingNews ? (
                                                <>
                                                    <img src={editingNews.imageUrl} alt="Current" className="h-20 w-auto mb-2 rounded" />
                                                    <p className="text-xs text-gray-400">Click to change image</p>
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                    </svg>
                                                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold text-green-600">Click to upload image</span></p>
                                                </>
                                            )}
                                        </div>
                                        <input id="news-image-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} required={!editingNews} />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={uploading}
                                className={`px-6 py-2.5 rounded-lg font-semibold text-white transition-colors ${
                                    uploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                                }`}
                            >
                                {uploading ? 'Saving...' : (editingNews ? 'Update News' : 'Add News')}
                            </button>
                            <button
                                type="button"
                                onClick={cancelForm}
                                className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* News List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800">News Articles</h3>
                        <p className="text-sm text-gray-500">Manage news articles and publications</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">
                            Total: {news.length}
                        </span>
                        {!showCreateForm && (
                            <>
                                <button
                                    onClick={handleImportExisting}
                                    disabled={migrating}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                                        migrating 
                                            ? 'bg-gray-400 text-white cursor-not-allowed' 
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                    </svg>
                                    {migrating ? 'Importing...' : 'Import Existing News'}
                                </button>
                                <button
                                    onClick={() => setShowCreateForm(true)}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                    </svg>
                                    Add News
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {news.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">No news articles found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {news.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4">
                                            <img src={item.imageUrl} alt={item.title} className="h-16 w-24 object-cover rounded" />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.title}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.date}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{item.excerpt}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                {item.link && (
                                                    <a
                                                        href={item.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="View Article"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                                            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                                        </svg>
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => startEdit(item)}
                                                    className="text-blue-600 hover:text-blue-800 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    disabled={deletingId === item._id}
                                                    className={`p-2 rounded-lg transition-colors ${
                                                        deletingId === item._id
                                                            ? 'text-gray-400 cursor-not-allowed'
                                                            : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                                                    }`}
                                                    title="Delete"
                                                >
                                                    {deletingId === item._id ? (
                                                        <span className="text-xs">Processing...</span>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
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

export default NewsTab;
