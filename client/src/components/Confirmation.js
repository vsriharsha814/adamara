import React from 'react';
import { useFormContext } from 'react-hook-form';

const Confirmation = () => {
  const { watch } = useFormContext();
  
  // Get all form values
  const formValues = watch();
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Request Submitted Successfully!</h2>
      
      <div className="p-4 mb-6 bg-green-50 border border-green-200 rounded-md">
        <div className="flex items-center">
          <svg className="h-8 w-8 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-lg font-medium text-green-800">Thank You!</h3>
            <p className="text-green-700">
              Your ad request has been received and is being processed.
            </p>
          </div>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b">
          <h3 className="font-medium">Request Summary</h3>
        </div>
        
        <div className="p-4">
          <h4 className="font-medium text-gray-700 mb-2">Requester Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-6">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p>{formValues.requesterName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p>{formValues.requesterEmail}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Department</p>
              <p>{formValues.requesterDepartment}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p>{formValues.requesterPhone || 'Not provided'}</p>
            </div>
          </div>
          
          <h4 className="font-medium text-gray-700 mb-2">Ad Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-6">
            <div>
              <p className="text-sm text-gray-500">Ad Type</p>
              <p className="capitalize">{formValues.adType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Desired Completion</p>
              <p>{formatDate(formValues.desiredCompletionDate)}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Purpose</p>
              <p>{formValues.adPurpose}</p>
            </div>
            {formValues.targetAudience && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Target Audience</p>
                <p>{formValues.targetAudience}</p>
              </div>
            )}
            {formValues.budget && (
              <div>
                <p className="text-sm text-gray-500">Budget</p>
                <p>${formValues.budget}</p>
              </div>
            )}
          </div>
          
          {(formValues.adTitle || formValues.adDescription || formValues.specialInstructions) && (
            <>
              <h4 className="font-medium text-gray-700 mb-2">Content Information</h4>
              <div className="space-y-3 mb-6">
                {formValues.adTitle && (
                  <div>
                    <p className="text-sm text-gray-500">Title/Headline</p>
                    <p>{formValues.adTitle}</p>
                  </div>
                )}
                {formValues.adDescription && (
                  <div>
                    <p className="text-sm text-gray-500">Description/Body</p>
                    <p>{formValues.adDescription}</p>
                  </div>
                )}
                {formValues.specialInstructions && (
                  <div>
                    <p className="text-sm text-gray-500">Special Instructions</p>
                    <p>{formValues.specialInstructions}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        <div className="p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
          <ol className="list-decimal pl-5 space-y-2 text-blue-700">
            <li>Your request will be reviewed by our team (1-2 business days)</li>
            <li>You&apos;ll receive an email confirmation with your request details</li>
            <li>A team member may contact you if additional information is needed</li>
            <li>You&apos;ll be notified when your request status changes</li>
          </ol>
        </div>
        
        <div className="text-center text-gray-600">
          <p>
            If you have any questions, please contact the marketing team at <br />
            <a href="mailto:marketing@example.com" className="text-blue-600 hover:underline">
              marketing@example.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;