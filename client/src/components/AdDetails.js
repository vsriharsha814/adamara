import React from 'react';
import { useFormContext } from 'react-hook-form';
import CustomDropdown from './CustomDropdown';

const AdDetails = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  const adType = watch('adType');
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Ad Details</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="adType" className="block mb-1 font-medium">
            Ad Type <span className="text-red-500">*</span>
          </label>
          <select
            id="adType"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.adType ? 'border-red-500' : 'border-gray-300'
            }`}
            {...register('adType', { 
              required: 'Ad type is required' 
            })}
          >
            <option value="print">Print</option>
            <option value="digital">Digital</option>
            <option value="social">Social Media</option>
            <option value="video">Video</option>
            <option value="other">Other</option>
          </select>
          {errors.adType && (
            <p className="mt-1 text-sm text-red-500">{errors.adType.message}</p>
          )}
        </div>
        
        {adType === 'print' && (
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Print Ad Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="printSize" className="block mb-1 text-sm">Size</label>
                <select
                  id="printSize"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register('printSize')}
                >
                  <option value="fullPage">Full Page</option>
                  <option value="halfPage">Half Page</option>
                  <option value="quarterPage">Quarter Page</option>
                  <option value="custom">Custom Size</option>
                </select>
              </div>
              <div>
                <label htmlFor="printColor" className="block mb-1 text-sm">Color</label>
                <select
                  id="printColor"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register('printColor')}
                >
                  <option value="fullColor">Full Color</option>
                  <option value="blackWhite">Black & White</option>
                  <option value="spotColor">Spot Color</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {adType === 'digital' && (
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Digital Ad Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="digitalFormat" className="block mb-1 text-sm">Format</label>
                <select
                  id="digitalFormat"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register('digitalFormat')}
                >
                  <option value="banner">Banner Ad</option>
                  <option value="popup">Pop-up</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="native">Native Ad</option>
                </select>
              </div>
              <div>
                <label htmlFor="digitalSize" className="block mb-1 text-sm">Size</label>
                <select
                  id="digitalSize"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register('digitalSize')}
                >
                  <option value="leaderboard">Leaderboard (728×90)</option>
                  <option value="medium">Medium Rectangle (300×250)</option>
                  <option value="skyscraper">Skyscraper (160×600)</option>
                  <option value="custom">Custom Size</option>
                </select>
              </div>
            </div>
          </div>
        )}
        
        {adType === 'social' && (
          <div className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Social Media Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="socialPlatform" className="block mb-1 text-sm">Platform</label>
                <select
                  id="socialPlatform"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register('socialPlatform')}
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>
              <div>
                <label htmlFor="socialType" className="block mb-1 text-sm">Type</label>
                <select
                  id="socialType"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  {...register('socialType')}
                >
                  <option value="post">Regular Post</option>
                  <option value="story">Story</option>
                  <option value="carousel">Carousel</option>
                  <option value="video">Video</option>
                </select>
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