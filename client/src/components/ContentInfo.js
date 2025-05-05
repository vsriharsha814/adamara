import React from 'react';
import { useFormContext } from 'react-hook-form';

const ContentInfo = () => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Content Information</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="adTitle" className="block mb-1 font-medium">
            Ad Title/Headline
          </label>
          <input
            id="adTitle"
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Main headline for your ad"
            {...register('adTitle')}
          />
          <p className="mt-1 text-sm text-gray-500">
            Keep it concise and attention-grabbing (recommended: 5-10 words)
          </p>
        </div>
        
        <div>
          <label htmlFor="adDescription" className="block mb-1 font-medium">
            Ad Description/Body Copy
          </label>
          <textarea
            id="adDescription"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Main content of your ad"
            {...register('adDescription')}
          ></textarea>
          <p className="mt-1 text-sm text-gray-500">
            Provide the main message you want to communicate through this ad
          </p>
        </div>
        
        <div>
          <label htmlFor="specialInstructions" className="block mb-1 font-medium">
            Special Instructions
          </label>
          <textarea
            id="specialInstructions"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Additional details or specific requirements"
            {...register('specialInstructions')}
          ></textarea>
          <p className="mt-1 text-sm text-gray-500">
            Include any specific requirements, branding guidelines, or additional notes
          </p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-md">
          <h3 className="font-medium mb-2">Content Guidelines</h3>
          <ul className="space-y-1 text-sm text-gray-600 list-disc pl-5">
            <li>Use clear, concise language that speaks directly to your target audience</li>
            <li>Include a specific call-to-action when appropriate</li>
            <li>Ensure all claims are factually accurate and can be substantiated</li>
            <li>Avoid using copyrighted material without proper permission</li>
            <li>Adhere to company branding guidelines for tone, voice, and messaging</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContentInfo;