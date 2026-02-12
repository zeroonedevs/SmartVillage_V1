"use client"
import React, { useState, useEffect } from 'react';

function Page() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState('');
  const eventsPerPage = 15;
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/dashboard/viewactivities');
        const data = await response.json();
        if (data.success) {
          setActivities(data.data);
        } else {
          console.error("Failed to fetch activities");
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  // Calculate year-wise counts dynamically from fetched data
  const getEventCount = () => {
    if (!selectedYear) return activities.length;
    return activities.filter(activity => activity.year === selectedYear).length;
  };

  // Calculate total students dynamically based on selected year
  const getTotalStudents = () => {
    const targetActivities = selectedYear
      ? activities.filter(activity => activity.year === selectedYear)
      : activities;

    return targetActivities.reduce((sum, activity) => {
      // Ensure we handle potential string values or missing data safely
      return sum + (Number(activity.studentsParticipated) || 0);
    }, 0);
  };

  // Function to handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  // Sort the data based on the selected column and order
  let sortedData = [...activities];
  if (sortBy) {
    sortedData = sortedData.sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        const valA = a[sortBy] ? String(a[sortBy]) : '';
        const valB = b[sortBy] ? String(b[sortBy]) : '';
        return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
    });
  }

  // Filtered data based on search query and selected year
  const filteredData = sortedData.filter(event =>
    (selectedYear === '' || (event.year && event.year.includes(selectedYear))) &&
    Object.values(event).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Calculate the index of the first and last events of the current page
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredData.slice(indexOfFirstEvent, indexOfLastEvent);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  // Extract unique years from the data for the dropdown options
  const years = Array.from(new Set(activities.map(event => event.year))).filter(Boolean).sort().reverse();

  // Helper to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Format as DD-MM-YYYY
    return date.toLocaleDateString('en-GB').replace(/\//g, '-');
  };

  if (loading) {
    return <div className="flex justify-center items-center py-20 text-gray-600">Loading activities...</div>;
  }

  return (
    <div className='w-full'>
      <div className="w-[98%] mx-auto p-1">

        {/* Header Controls */}
        <div className="w-full mx-auto flex flex-col md:flex-row justify-between items-center py-4 gap-4">

          {/* Search Box - Left */}
          <div className="w-full md:w-[20%]">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="border border-green-600 p-2 w-full focus:outline-none focus:ring-1 focus:ring-green-600"
            />
          </div>

          {/* Title - Center */}
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-extrabold text-black">Activities List</h1>
          </div>

          {/* Dropdown & Home Button - Right */}
          <div className="w-full md:w-auto flex gap-2">

            <div className='bg-[#008000] p-1 flex items-center justify-center min-w-[100px]'>
              <select
                className='bg-[#008000] text-white outline-none border-none w-full text-center font-semibold cursor-pointer appearance-none'
                id="year"
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
                style={{ textAlignLast: 'center' }}
              >
                <option value="">All</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <a
              href="/"
              className="bg-[#008000] text-white px-4 py-2 font-semibold no-underline hover:bg-green-700 transition-colors whitespace-nowrap"
            >
              Back to Home
            </a>
          </div>
        </div>

        {/* Table Area */}
        <div className="w-full border border-green-700">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th onClick={() => handleSort('date')} className="bg-[#008000] text-white font-bold p-3 border border-green-700 w-[15%] cursor-pointer hover:bg-green-700 transition-colors">Date</th>
                <th onClick={() => handleSort('name')} className="bg-[#008000] text-white font-bold p-3 border border-green-700 w-[55%] text-left cursor-pointer hover:bg-green-700 transition-colors">Name of the Activity</th>
                <th onClick={() => handleSort('studentsParticipated')} className="bg-[#008000] text-white font-bold p-3 border border-green-700 w-[20%] cursor-pointer hover:bg-green-700 transition-colors">Number of Students<br />Participated</th>
                <th className="bg-[#008000] text-white font-bold p-3 border border-green-700 w-[10%]">Report</th>
              </tr>
            </thead>
            <tbody>
              {currentEvents.map((event, index) => (
                <tr key={event._id || index} className="bg-white hover:bg-gray-50">
                  <td className="border border-green-700 text-center font-medium p-2 text-black">{formatDate(event.date)}</td>
                  <td className="border border-green-700 text-left font-medium p-2 text-black">{event.name}</td>
                  <td className="border border-green-700 text-center font-medium p-2 text-black">{event.studentsParticipated}</td>
                  <td className="border border-green-700 text-center font-medium p-2 text-black">
                    {event.reportLink ? (
                      <a href={event.reportLink} target="_blank" rel="noopener noreferrer" className="text-black hover:underline font-medium">
                        View
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">--</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Toolbar - Bottom Green Bar */}
        <div className="flex flex-wrap items-center gap-1 mt-4">

          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-[#008000] text-white px-4 py-2 font-medium disabled:opacity-50 hover:bg-green-700"
          >
            Prev
          </button>

          <div className="bg-[#008000] text-white px-4 py-2 font-medium">
            Page {currentPage} of {Math.ceil(filteredData.length / eventsPerPage) || 1}
          </div>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage >= Math.ceil(filteredData.length / eventsPerPage)}
            className="bg-[#008000] text-white px-4 py-2 font-medium disabled:opacity-50 hover:bg-green-700"
          >
            Next
          </button>

          <div className="bg-[#008000] text-white px-4 py-2 font-medium">
            Events Count: {getEventCount()}
          </div>

          <div className="bg-[#008000] text-white px-4 py-2 font-medium">
            Total Students: {getTotalStudents()}
          </div>

        </div>

      </div>
    </div>
  );
}

export default Page;