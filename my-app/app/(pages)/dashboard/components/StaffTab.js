import React, { useState, useEffect } from 'react';

const StaffTab = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch('/api/staff');
      const data = await response.json();
      if (data.success) {
        setStaffList(data.data);
      } else {
        setError('Failed to fetch staff');
      }
    } catch (err) {
      setError('Error fetching staff');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setFormData({ name: '', designation: '' });
        fetchStaff();
      } else {
        setError(data.error || 'Failed to add staff');
      }
    } catch (err) {
      setError('Error adding staff');
    }
  };

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this staff member?')) return;
    setDeletingId(id);
    try {
      const response = await fetch('/api/staff', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        fetchStaff();
      } else {
        setError(data.error || 'Failed to delete staff');
      }
    } catch (err) {
      setError('Error deleting staff');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="dash-panel p-5 sm:p-6">
      <h2 className="dash-section-title mb-1">Staff directory</h2>
      <p className="dash-section-desc mb-6">Add or remove staff shown on the public site.</p>

      {/* Add Staff Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 rounded-xl border border-slate-200 bg-slate-50/80 p-5"
      >
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Add staff member</h3>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Staff Name"
            value={formData.name}
            onChange={handleChange}
            className="dash-form-input-muted"
            required
          />
          <input
            type="text"
            name="designation"
            placeholder="Designation"
            value={formData.designation}
            onChange={handleChange}
            className="dash-form-input-muted"
            required
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800"
          >
            Add staff member
          </button>
        </div>
      </form>

      {/* Staff List Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="p-4 font-semibold">Name</th>
                <th className="p-4 font-semibold">Designation</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {staffList.length > 0 ? (
                staffList.map(staff => (
                  <tr key={staff._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-medium text-slate-900">{staff.name}</td>
                    <td className="p-4">{staff.designation}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(staff._id)}
                        disabled={deletingId === staff._id}
                        className={`p-2 rounded-lg transition-colors ${
                          deletingId === staff._id
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                        }`}
                        title="Delete Staff"
                      >
                        {deletingId === staff._id ? (
                          <span className="text-xs">Processing...</span>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-400 italic">
                    No staff members added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffTab;
