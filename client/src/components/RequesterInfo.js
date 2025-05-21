import React from 'react';
import { useFormContext } from 'react-hook-form';

const RequesterInfo = () => {
  const { register, formState: { errors, touchedFields } } = useFormContext();
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Requester Information</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="requesterName" className="block mb-1 font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="requesterName"
            type="text"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.requesterName ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('requesterName', { 
              required: 'Name is required' 
            })}
          />
          {errors.requesterName && (
            <p className="mt-1 text-sm text-red-500">{errors.requesterName.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="requesterEmail" className="block mb-1 font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="requesterEmail"
            type="email"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.requesterEmail ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('requesterEmail', { 
              required: 'Email is required',
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: 'Please enter a valid email address'
              },
              validate: (value) => {
                // Only validate email format when the field isn't empty
                if (value.trim() === '') return true;
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'Please enter a valid email address';
              }
            })}
          />
          {touchedFields.requesterEmail && errors.requesterEmail && (
            <p className="mt-1 text-sm text-red-500">{errors.requesterEmail.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="requesterDepartment" className="block mb-1 font-medium">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            id="requesterDepartment"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.requesterDepartment ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('requesterDepartment', { 
              required: 'Department is required' 
            })}
          >
            <option value="">Select a department</option>
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
          {errors.requesterDepartment && (
            <p className="mt-1 text-sm text-red-500">{errors.requesterDepartment.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="requesterPhone" className="block mb-1 font-medium">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            id="requesterPhone"
            type="tel"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.requesterPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., (123) 456-7890"
            {...register('requesterPhone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[\d\s()+.-]+$/,
                message: 'Please enter a valid phone number'
              }
            })}
          />
          {errors.requesterPhone && (
            <p className="mt-1 text-sm text-red-500">{errors.requesterPhone.message}</p>
          )}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-md">
        <p className="text-sm">
          <span className="font-semibold">Note:</span> Fields marked with <span className="text-red-500">*</span> are required.
        </p>
      </div>
    </div>
  );
};

export default RequesterInfo;