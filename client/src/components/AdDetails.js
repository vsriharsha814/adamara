import React from 'react';
import { useFormContext } from 'react-hook-form';
import CustomDropdown from './CustomDropdown';

const AdDetails = () => {
  const { register, watch, formState: { errors }, setValue } = useFormContext();
  const adType = watch('adType');
  
  // Define options for dropdowns
  const adTypeOptions = [
    { value: 'print', label: 'Print' },
    { value: 'digital', label: 'Digital' },
    { value: 'social', label: 'Social Media' },
    { value: 'video', label: 'Video' },
    { value: 'other', label: 'Other' }
  ];
  
  const printSizeOptions = [
    { value: 'fullPage', label: 'Full Page' },
    { value: 'halfPage', label: 'Half Page' },
    { value: 'quarterPage', label: 'Quarter Page' },
    { value: 'custom', label: 'Custom Size' }
  ];
  
  const printColorOptions = [
    { value: 'fullColor', label: 'Full Color' },
    { value: 'blackWhite', label: 'Black & White' },
    { value: 'spotColor', label: 'Spot Color' }
  ];
  
  const digitalFormatOptions = [
    { value: 'banner', label: 'Banner Ad' },
    { value: 'popup', label: 'Pop-up' },
    { value: 'sidebar', label: 'Sidebar' },
    { value: 'native', label: 'Native Ad' }
  ];
  
  const digitalSizeOptions = [
    { value: 'leaderboard', label: 'Leaderboard (728×90)' },
    { value: 'medium', label: 'Medium Rectangle (300×250)' },
    { value: 'skyscraper', label: 'Skyscraper (160×600)' },
    { value: 'custom', label: 'Custom Size' }
  ];
  
  const socialPlatformOptions = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' }
  ];
  
  const socialTypeOptions = [
    { value: 'post', label: 'Regular Post' },
    { value: 'story', label: 'Story' },
    { value: 'carousel', label: 'Carousel' },
    { value: 'video', label: 'Video' }
  ];
  
  // Custom handler for dropdown change
  const handleDropdownChange = (e) => {
    setValue(e.target.name, e.target.value);
  };
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ad Details</h2>
      
      <div className="space-y-4">
        <div>
          <CustomDropdown
            label="Ad Type"
            name="adType"
            options={adTypeOptions}
            value={adType}
            onChange={handleDropdownChange}
            required={true}
            error={errors.adType?.message}
          />
        </div>
        
        {adType === 'print' && (
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Print Ad Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CustomDropdown
                  label="Size"
                  name="printSize"
                  options={printSizeOptions}
                  value={watch('printSize')}
                  onChange={handleDropdownChange}
                />
              </div>
              <div>
                <CustomDropdown
                  label="Color"
                  name="printColor"
                  options={printColorOptions}
                  value={watch('printColor')}
                  onChange={handleDropdownChange}
                />
              </div>
            </div>
          </div>
        )}
        
        {adType === 'digital' && (
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Digital Ad Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CustomDropdown
                  label="Format"
                  name="digitalFormat"
                  options={digitalFormatOptions}
                  value={watch('digitalFormat')}
                  onChange={handleDropdownChange}
                />
              </div>
              <div>
                <CustomDropdown
                  label="Size"
                  name="digitalSize"
                  options={digitalSizeOptions}
                  value={watch('digitalSize')}
                  onChange={handleDropdownChange}
                />
              </div>
            </div>
          </div>
        )}
        
        {adType === 'social' && (
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Social Media Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <CustomDropdown
                  label="Platform"
                  name="socialPlatform"
                  options={socialPlatformOptions}
                  value={watch('socialPlatform')}
                  onChange={handleDropdownChange}
                />
              </div>
              <div>
                <CustomDropdown
                  label="Type"
                  name="socialType"
                  options={socialTypeOptions}
                  value={watch('socialType')}
                  onChange={handleDropdownChange}
                />
              </div>
            </div>
          </div>
        )}
        
        <div>
          <label htmlFor="adPurpose" className="block mb-1 font-medium">
            Purpose of Ad <span className="text-red-500">*</span>
          </label>
          <textarea
            id="adPurpose"
            rows="3"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.adPurpose ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="What is the main goal of this ad? (e.g., promote new product, increase brand awareness)"
            {...register('adPurpose', { 
              required: 'Purpose is required' 
            })}
          ></textarea>
          {errors.adPurpose && (
            <p className="mt-1 text-sm text-red-500">{errors.adPurpose.message}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="targetAudience" className="block mb-1 font-medium">
            Target Audience
          </label>
          <textarea
            id="targetAudience"
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Who is the intended audience for this ad? (e.g., age group, interests, demographics)"
            {...register('targetAudience')}
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="desiredPlacement" className="block mb-1 font-medium">
            Desired Placement
          </label>
          <input
            id="desiredPlacement"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Where would you like this ad to appear? (e.g., specific website, magazine, location)"
            {...register('desiredPlacement')}
          />
        </div>
        
        <div>
          <label htmlFor="budget" className="block mb-1 font-medium">
            Budget
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <span className="text-gray-500">$</span>
            </div>
            <input
              id="budget"
              type="number"
              className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Estimated budget (optional)"
              {...register('budget', {
                valueAsNumber: true,
                min: {
                  value: 0,
                  message: 'Budget cannot be negative'
                }
              })}
            />
          </div>
          {errors.budget && (
            <p className="mt-1 text-sm text-red-500">{errors.budget.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdDetails;