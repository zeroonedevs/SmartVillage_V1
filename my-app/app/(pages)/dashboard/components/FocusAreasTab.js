'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const FocusAreasTab = () => {
  const [focusAreas, setFocusAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    fetchFocusAreas();
  }, []);

  const fetchFocusAreas = async () => {
    try {
      const response = await fetch('/api/focus-areas');
      if (response.status === 401) {
        router.push('/login');
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch focus areas');
      const data = await response.json();
      if (data.success) {
        setFocusAreas(data.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      let imageUrl = '';
      if (selectedFile || editingArea) {
        if (selectedFile) {
          const formDataUpload = new FormData();
          formDataUpload.append('file', selectedFile);
          formDataUpload.append('folder', 'focus_areas');

          const uploadRes = await fetch('/api/dashboard/upload', {
            method: 'POST',
            body: formDataUpload,
          });

          const uploadData = await uploadRes.json();
          if (!uploadRes.ok) throw new Error(uploadData.error || 'Image upload failed');
          imageUrl = uploadData.fileUrl;
        } else {
          imageUrl = editingArea.image;
        }
      } else {
        throw new Error('Image is required');
      }

      const url = editingArea ? `/api/focus-areas/${editingArea._id}` : '/api/focus-areas';
      const method = editingArea ? 'PUT' : 'POST';

      const saveRes = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          image: imageUrl,
        }),
      });

      const saveData = await saveRes.json();
      if (saveData.success) {
        if (editingArea) {
          setFocusAreas(focusAreas.map(a => (a._id === editingArea._id ? saveData.data : a)));
        } else {
          setFocusAreas([...focusAreas, saveData.data].sort((a, b) => a.order - b.order));
        }
        cancelForm();
        toast.success(editingArea ? 'Focus area updated!' : 'Focus area added!');
      } else {
        throw new Error(saveData.error || 'Failed to save focus area');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async id => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/focus-areas/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFocusAreas(focusAreas.filter(a => a._id !== id));
      } else {
        toast.error('Failed to delete');
      }
    } catch (err) {
      toast.error('Error deleting');
    }
  };

  const startEdit = area => {
    setEditingArea(area);
    setFormData({
      title: area.title,
      description: area.description,
      order: area.order,
      isActive: area.isActive,
    });
    setSelectedFile(null);
    setShowCreateForm(true);
  };

  const cancelForm = () => {
    setShowCreateForm(false);
    setEditingArea(null);
    setFormData({ title: '', description: '', order: focusAreas.length + 1, isActive: true });
    setSelectedFile(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-11 w-11 border-2 border-green-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showCreateForm && (
        <div className="dash-panel p-6 sm:p-8">
          <h3 className="dash-section-title mb-1">
            {editingArea ? 'Edit focus area' : 'Add focus area'}
          </h3>
          <p className="dash-section-desc mb-5">Image and details for the 9-way focus area.</p>
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-lg px-4 py-2 mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="dash-form-input"
                required
              />
              <input
                name="order"
                type="number"
                value={formData.order}
                onChange={handleInputChange}
                placeholder="Order (1-9)"
                className="dash-form-input"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="dash-form-input col-span-2 min-h-[88px]"
                rows="3"
                required
              />
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-slate-700">Image</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-green-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-green-800"
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 disabled:opacity-60"
                disabled={uploading}
              >
                {uploading ? 'Saving…' : 'Save'}
              </button>
              <button
                type="button"
                onClick={cancelForm}
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="dash-panel overflow-hidden">
        <div className="dash-panel-head">
          <div>
            <h3 className="dash-section-title">Focus areas (9-way)</h3>
            <p className="dash-section-desc">Manage the nine focus areas shown on the site.</p>
          </div>
          {!showCreateForm && (
            <button
              type="button"
              onClick={() => setShowCreateForm(true)}
              className="shrink-0 rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800"
            >
              Add new
            </button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="p-4 text-left">Order</th>
                <th className="p-4 text-left">Image</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {focusAreas.map(item => (
                <tr key={item._id} className="hover:bg-slate-50/80">
                  <td className="p-4">{item.order}</td>
                  <td className="p-4">
                    <img src={item.image} className="h-10 w-10 rounded object-cover" alt="" />
                  </td>
                  <td className="p-4 font-medium">{item.title}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => startEdit(item)}
                      className="text-blue-600 mr-3 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FocusAreasTab;
