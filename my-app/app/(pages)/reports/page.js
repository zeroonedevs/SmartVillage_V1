"use client"
import React, { useState, useEffect } from 'react';
import './page.css';

// import eventData from './data';

const itemsPerPage = 10; // Set the number of items per page

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState(''); // State to track the selected domain for filtering
  const [eventData, setEventData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch activities from API
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/dashboard/viewactivities');
        const data = await response.json();

        if (data.success) {
          // Map API data to component format
          const formattedActivities = data.data.map((activity, index) => ({
            sno: index + 1,
            date: new Date(activity.date).toLocaleDateString(), // Format date
            eventName: activity.eventName,
            domain: activity.domain,
            participants: activity.participants,
            reportLink: activity.reportLink,
            ...activity
          }));
          setEventData(formattedActivities);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Filter events based on search query and selected domain
  const filteredEventData = eventData.filter((event) =>
    Object.values(event).some((value) =>
        value && String(value).toLowerCase().includes(searchQuery.toLowerCase())
    ) &&
    (selectedDomain === '' || event.domain.toLowerCase() === selectedDomain.toLowerCase())
  );

  // Calculate starting and ending indices for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Get the items to be displayed on the current page
  const currentEventData = filteredEventData.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(filteredEventData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to the first page when the search query changes
  };

  const handleDomainFilterChange = (event) => {
    setSelectedDomain(event.target.value);
    setCurrentPage(1); // Reset to the first page when the domain filter changes
  };

  const uniqueDomains = [...new Set(eventData.map((event) => event.domain))];

  return (
    <div className='reports'>
      <div className="reports-in">
        <div className="reports-table">
          <div className="reports-table-top">
            <input
              className="reports-search"
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <div className="back-to-home">
              <a href="/"><i className="fas fa-arrow-left"></i> Back to Home</a>
            </div>
          </div>
          
          {loading ? (
             <div className="min-h-[300px] flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
             </div>
          ) : (
            <div className="reports-table-in">
                <div className="reports-table-in-one">
                <table>
                    <thead>
                    <tr>
                        <th>S NO</th>
                        <th>DATE</th>
                        <th>NAME OF THE EVENT</th>
                        <th>
                            DOMAIN
                            <select
                                className="reports-dropdown ml-2"
                                value={selectedDomain}
                                onChange={handleDomainFilterChange}
                            >
                                <option value="">All</option>
                                {uniqueDomains.filter(Boolean).map((domain) => (
                                    <option key={domain} value={domain}>
                                    {domain}
                                    </option>
                                ))}
                            </select>
                        </th>
                        <th>Students Participated</th>
                        <th>Report</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentEventData.length > 0 ? (
                        currentEventData.map((event) => (
                            <tr key={event.sno}>
                            <td>{event.sno}</td>
                            <td>{event.date}</td>
                            <td>{event.eventName}</td>
                            <td>{event.domain}</td>
                            <td>{event.participants}</td>
                            <td>
                                {event.reportLink ? (
                                    <a 
                                        href={event.reportLink} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-green-600 hover:text-green-800 font-medium underline"
                                    >
                                        View Report
                                    </a>
                                ) : (
                                    <span className="text-gray-400 italic">Not available</span>
                                )}
                            </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center py-8 text-gray-500">
                                No activity reports found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                </div>
                {/* Pagination controls */}
                {filteredEventData.length > itemsPerPage && (
                    <div className="pagination">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                    </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
