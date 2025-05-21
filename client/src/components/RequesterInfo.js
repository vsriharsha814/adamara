import React from 'react';
import { useFormContext } from 'react-hook-form';
import CustomDropdown from './CustomDropdown';

const RequesterInfo = () => {
  const { register, watch, formState: { errors, touchedFields }, setValue } = useFormContext();
  
  // Define options for department dropdown
  const departmentOptions = [
    { value: '', label: 'Select a department' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Sales', label: 'Sales' },
    { value: 'Product', label: 'Product' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'HR', label: 'Human Resources' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Customer Support', label: 'Customer Support' },
    { value: 'Other', label: 'Other' }
  ];
  
  // Custom handler for dropdown change
  const handleDropdownChange = (e) => {
    setValue(e.target.name, e.target.value);
  };
  
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
          <CustomDropdown
            label="Department"
            name="requesterDepartment"
            options={departmentOptions}
            value={watch('requesterDepartment')}
            onChange={handleDropdownChange}
            required={true}
            error={errors.requesterDepartment?.message}
          />
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