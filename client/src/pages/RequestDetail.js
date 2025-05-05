import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Fetch request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      setLoading(true);
      setError('');
      
      try {
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          throw new Error('Not authenticated');
        }
        
        const response = await axios.get(`/api/requests/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setRequest(response.data.request);
        setStatus(response.data.request.status);
      } catch (err) {
        console.error('Error fetching request details:', err);
        setError(
          err.response?.data?.message || 
          'Failed to load request details. Please try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequestDetails();
  }, [id]);
  
  // Update request status and add note
  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Not authenticated');
      }
      
      // Prepare update data
      const updateData = {
        status
      };
      
      // Add note if provided
      if (note.trim()) {
        updateData.note = note;
      }
      
      // Send update request
      const response = await axios.put(`/api/requests/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update local state with new data
      setRequest(response.data.request);
      setNote(''); // Clear note input
      
      // Show success message (could use a toast notification in a real app)
      alert('Request updated successfully');
    } catch (err) {
      console.error('Error updating request:', err);
      setError(
        err.response?.data?.message || 
        'Failed to update request. Please try again.'
      );
    } finally {
      setUpdateLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
  
  // Capitalize first letter
  const capitalize = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  
  // File icon based on type
  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) {
      return (
        <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
    } else if (fileType.includes('pdf')) {
      return (
        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    } else {
      return (
        <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
  };
  
  // Back to dashboard
  const goBack = () => {
    navigate('/admin/dashboard');
  };
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-red-100 p-4 rounded-md text-red-700 mb-4">
          <p>{error}</p>
        </div>
        <button
          onClick={goBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  if (!request) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-yellow-100 p-4 rounded-md text-yellow-700 mb-4">
          <p>Request not found.</p>
        </div>
        <button
          onClick={goBack}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header with back button */}
      <div className="mb-6 flex items-center">
        <button
          onClick={goBack}
          className="mr-4 p-2 rounded-md hover:bg-gray-100"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Request Details</h1>
          <p className="text-gray-600">ID: {request._id}</p>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Request details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Request overview */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Request Overview</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(request.status)}`}>
                    {request.status === 'in-review' ? 'In Review' : capitalize(request.status)}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ad Type</p>
                  <p className="font-medium capitalize">{request.adType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Requested On</p>
                  <p className="font-medium">{formatDate(request.requestDate)}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-4">
                <p className="text-sm text-gray-500">Ad Purpose</p>
                <p className="mt-1">{request.adPurpose}</p>
              </div>
              
              {request.targetAudience && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-sm text-gray-500">Target Audience</p>
                  <p className="mt-1">{request.targetAudience}</p>
                </div>
              )}
              
              {request.desiredPlacement && (
                <div className="border-t border-gray-200 pt-4 mb-4">
                  <p className="text-sm text-gray-500">Desired Placement</p>
                  <p className="mt-1">{request.desiredPlacement}</p>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-4 mb-4">
                <p className="text-sm text-gray-500">Desired Completion Date</p>
                <p className="mt-1 font-medium">{formatDate(request.desiredCompletionDate)}</p>
              </div>
              
              {request.budget && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="mt-1">${request.budget}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Requester Information */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Requester Information</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{request.requesterName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{request.requesterEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{request.requesterDepartment}</p>
                </div>
                {request.requesterPhone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{request.requesterPhone}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Content Information */}
          {(request.adTitle || request.adDescription || request.specialInstructions) && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Content Information</h2>
              </div>
              <div className="p-6">
                {request.adTitle && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Ad Title/Headline</p>
                    <p className="mt-1 font-medium">{request.adTitle}</p>
                  </div>
                )}
                
                {request.adDescription && (
                  <div className="mb-4 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500">Ad Description/Body Copy</p>
                    <p className="mt-1 whitespace-pre-line">{request.adDescription}</p>
                  </div>
                )}
                
                {request.specialInstructions && (
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500">Special Instructions</p>
                    <p className="mt-1 whitespace-pre-line">{request.specialInstructions}</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Attached Files */}
          {request.files && request.files.length > 0 && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium">Attached Files</h2>
              </div>
              <ul className="divide-y divide-gray-200">
                {request.files.map((file, index) => (
                  <li key={index} className="p-4 flex items-center">
                    {getFileIcon(file.fileType)}
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{file.originalName}</p>
                      <p className="text-xs text-gray-500">
                        {(file.fileSize / 1024 / 1024).toFixed(2)} MB • Uploaded {formatDate(file.uploadDate)}
                      </p>
                    </div>
                    <a
                      href={file.fileURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {/* Right column - Admin actions and notes */}
        <div className="space-y-6">
          {/* Update Status */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Update Status</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateRequest}>
                <div className="mb-4">
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-review">In Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">
                    Add Note (Optional)
                  </label>
                  <textarea
                    id="note"
                    rows="3"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Add a note about this update..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={updateLoading}
                  className={`w-full px-4 py-2 text-white rounded-md ${
                    updateLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {updateLoading ? 'Updating...' : 'Update Request'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Admin Notes */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Admin Notes</h2>
            </div>
            {request.adminNotes && request.adminNotes.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {request.adminNotes.map((note, index) => (
                  <li key={index} className="p-4">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-medium text-gray-900">
                        {note.createdBy?.name || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(note.createdAt)}
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{note.note}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No notes added yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetail;