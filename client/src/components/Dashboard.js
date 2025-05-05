import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    department: '',
    startDate: '',
    endDate: ''
  });

  // Fetch requests
  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Build query params
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', 10);
      
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.department) params.append('department', filters.department);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await axios.get(`/api/requests?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setRequests(response.data.requests);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('Failed to load requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Apply filters
  const applyFilters = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRequests();
  };
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      status: '',
      search: '',
      department: '',
      startDate: '',
      endDate: ''
    });
    setCurrentPage(1);
    // fetchRequests will be called by useEffect when filters change
  };
  
  // Handle pagination
  const changePage = (page) => {
    setCurrentPage(page);
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in-review':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Export requests as CSV
  const exportToCsv = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Build query params for export (using same filters)
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.department) params.append('department', filters.department);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      // Request CSV file
      const response = await axios.get(`/api/requests/export/csv?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ad-requests-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV:', err);
      setError('Failed to export data. Please try again.');
    }
  };
  
  // Fetch requests on mount and when filters/page change
  useEffect(() => {
    fetchRequests();
  }, [currentPage]);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Ad Requests Dashboard</h1>
        <p className="text-gray-600">Manage and process ad requests</p>
      </div>
      
      {/* Filters */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <form onSubmit={applyFilters}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Name or email"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-review">In Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                id="department"
                name="department"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.department}
                onChange={handleFilterChange}
              >
                <option value="">All Departments</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Product">Product</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">Human Resources</option>
                <option value="Finance">Finance</option>
                <option value="Operations">Operations</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Reset Filters
            </button>
            <div className="space-x-3">
              <button
                type="button"
                onClick={exportToCsv}
                className="px-4 py-2 text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200"
              >
                Export CSV
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </form>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Requests table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No requests found. Try adjusting your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ad Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Request Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{request.requesterName}</div>
                      <div className="text-sm text-gray-500">{request.requesterEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.requesterDepartment}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {request.adType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                        {request.status === 'in-review' ? 'In Review' : request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.requestDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(request.desiredCompletionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/requests/${request._id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => changePage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                Previous
              </button>
              {[...Array(totalPages).keys()].map((page) => (
                <button
                  key={page + 1}
                  onClick={() => changePage(page + 1)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === page + 1
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {page + 1}
                </button>
              )).slice(
                // Show limited page buttons to avoid overflow
                Math.max(0, currentPage - 3),
                Math.min(totalPages, currentPage + 2)
              )}
              <button
                onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-white text-blue-600 hover:bg-blue-50'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;