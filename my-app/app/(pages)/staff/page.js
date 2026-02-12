"use client"
import React, { useState, useEffect } from 'react';

function StaffPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch('/api/staff');
                const data = await response.json();
                if (data.success) {
                    setStaffList(data.data);
                }
            } catch (error) {
                console.error('Error fetching staff:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    // Filtering Logic
    const filteredStaff = staffList.filter(staff =>
        Object.values(staff).some(val =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className='w-full'>
            <div className="w-[98%] mx-auto p-1">

                {/* Header Controls */}
                <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center py-4 gap-4">

                    {/* Search Box */}
                    <div className="w-full md:w-[20%]">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="border border-[#008000] p-2 w-full focus:outline-none focus:ring-1 focus:ring-[#008000]"
                        />
                    </div>

                    {/* Title */}
                    <div className="flex-1 text-center">
                        <h1 className="text-3xl font-extrabold text-black">Staff Directory</h1>
                    </div>

                    {/* Back Button */}
                    <div className="w-full md:w-auto">
                        <a
                            href="/"
                            className="bg-[#008000] text-white px-4 py-2 font-semibold no-underline hover:bg-green-700 transition-colors whitespace-nowrap block text-center"
                        >
                            Back to Home
                        </a>
                    </div>
                </div>

                {/* Table Area */}
                <div className="w-full border border-[#008000]">
                    {loading ? (
                        <div className="p-20 text-center text-gray-600">Loading staff data...</div>
                    ) : (
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="bg-[#008000] text-white font-bold p-3 border border-green-700 w-[10%]">S.No</th>
                                    <th className="bg-[#008000] text-white font-bold p-3 border border-green-700 w-[50%] text-left">Name of the Staff</th>
                                    <th className="bg-[#008000] text-white font-bold p-3 border border-green-700 w-[40%] text-left">Designation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((staff, index) => (
                                        <tr key={staff.id || staff._id} className="bg-white hover:bg-gray-50">
                                            <td className="border border-green-700 text-center font-medium p-2 text-black">{indexOfFirstItem + index + 1}</td>
                                            <td className="border border-green-700 text-left font-medium p-2 text-black">{staff.name}</td>
                                            <td className="border border-green-700 text-left font-medium p-2 text-black">{staff.designation}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="border border-green-700 text-center p-8 text-gray-500 italic">
                                            No staff members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer Toolbar */}
                {!loading && (
                    <div className="flex flex-wrap items-center gap-1 mt-4">

                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="bg-[#008000] text-white px-4 py-2 font-medium disabled:opacity-50 hover:bg-green-700"
                        >
                            Prev
                        </button>

                        <div className="bg-[#008000] text-white px-4 py-2 font-medium">
                            Page {currentPage} of {Math.ceil(filteredStaff.length / itemsPerPage) || 1}
                        </div>

                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage >= Math.ceil(filteredStaff.length / itemsPerPage)}
                            className="bg-[#008000] text-white px-4 py-2 font-medium disabled:opacity-50 hover:bg-green-700"
                        >
                            Next
                        </button>

                        <div className="bg-[#008000] text-white px-4 py-2 font-medium ml-auto">
                            Total Staff: {staffList.length}
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}

export default StaffPage;
