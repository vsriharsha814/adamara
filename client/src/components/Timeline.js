import React from 'react';
import { useFormContext } from 'react-hook-form';

const Timeline = () => {
  const { register, formState: { errors } } = useFormContext();
  
  // Calculate minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  
  // Calculate a date 6 months from now for max date
  const sixMonthsLater = new Date(today);
  sixMonthsLater.setMonth(today.getMonth() + 6);
  const maxDate = sixMonthsLater.toISOString().split('T')[0];
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Timeline</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="desiredCompletionDate" className="block mb-1 font-medium">
            Desired Completion Date <span className="text-red-500">*</span>
          </label>
          <input
            id="desiredCompletionDate"
            type="date"
            min={minDate}
            max={maxDate}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.desiredCompletionDate ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('desiredCompletionDate', { 
              required: 'Completion date is required',
              validate: {
                futureDate: value => {
                  const selected = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return selected >= today || 'Date must be today or in the future';
                }
              }
            })}
          />
          {errors.desiredCompletionDate && (
            <p className="mt-1 text-sm text-red-500">{errors.desiredCompletionDate.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            When do you need this ad to be ready? Please allow at least 5 business days for processing.
          </p>
        </div>
        
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h3 className="font-medium text-yellow-800 mb-2">Estimated Timeline</h3>
          <ul className="space-y-2 text-sm text-yellow-700">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Review phase:</strong> 1-2 business days</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Design phase:</strong> 2-3 business days</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Revision phase:</strong> 1-2 business days</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-yellow-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Finalization:</strong> 1 business day</span>
            </li>
          </ul>
          <p className="mt-3 text-sm text-yellow-800">
            Rush requests may be accommodated based on availability but cannot be guaranteed.
          </p>
        </div>
        
        <div className="flex items-start p-4 bg-blue-50 border border-blue-200 rounded-md">
          <svg className="h-6 w-6 text-blue-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-medium text-blue-800 mb-1">Important Note</h3>
            <p className="text-sm text-blue-700">
              All ad requests are subject to review and approval. You will be notified via email about the status of your request and any additional information needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;