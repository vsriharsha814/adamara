import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Form steps components
import RequesterInfo from '../components/RequesterInfo';
import AdDetails from '../components/AdDetails';
import Timeline from '../components/Timeline';
import ContentInfo from '../components/ContentInfo';
import FileUpload from '../components/FileUpload';
import Confirmation from '../components/Confirmation';

const Form = () => {
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [requestId, setRequestId] = useState(null);
  const navigate = useNavigate();
  
  const methods = useForm({
    mode: 'onChange',
    defaultValues: {
      requesterName: '',
      requesterEmail: '',
      requesterDepartment: '',
      requesterPhone: '',
      adType: 'digital',
      adPurpose: '',
      targetAudience: '',
      desiredPlacement: '',
      budget: '',
      desiredCompletionDate: '',
      adTitle: '',
      adDescription: '',
      specialInstructions: ''
    }
  });
  
  const { handleSubmit, formState: { errors, isValid } } = methods;
  
  // Form steps array
  const steps = [
    { name: 'Requester Information', component: <RequesterInfo /> },
    { name: 'Ad Details', component: <AdDetails /> },
    { name: 'Timeline', component: <Timeline /> },
    { name: 'Content Information', component: <ContentInfo /> },
    { name: 'File Upload', component: <FileUpload files={files} setFiles={setFiles} /> },
    { name: 'Confirmation', component: <Confirmation /> }
  ];
  
  // Navigation functions
  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };
  
  // Submit form data
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Create form data object
      const formData = new FormData();
      
      // Append form fields
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      
      // Append files
      files.forEach(file => {
        formData.append('files', file);
      });
      
      // Submit to API
      const response = await axios.post('/api/requests', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Store request ID for confirmation
      setRequestId(response.data.requestId);
      
      // Go to final step
      setStep(steps.length - 1);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(
        error.response?.data?.message || 
        'There was a problem submitting your request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form and start over
  const handleReset = () => {
    methods.reset();
    setFiles([]);
    setStep(0);
    setRequestId(null);
  };
  
  // Go to homepage
  const handleDone = () => {
    navigate('/');
  };
  
  return (
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Ad Request Form</h1>
      
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((s, i) => (
            <div key={i} className="text-xs text-center">
              <div 
                className={`flex items-center justify-center w-8 h-8 mx-auto rounded-full mb-1 ${
                  i <= step ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {i + 1}
              </div>
              <div className={i <= step ? 'text-blue-500' : 'text-gray-500'}>
                {s.name}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Form error */}
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}
      
      {/* Form provider */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Current step */}
          <div className="mb-6">
            {steps[step].component}
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {step > 0 && step < steps.length - 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Previous
              </button>
            )}
            
            {step === 0 && (
              <div></div> // Empty div for flex spacing on first step
            )}
            
            {step < steps.length - 2 && (
              <button
                type="button"
                onClick={nextStep}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Next
              </button>
            )}
            
            {step === steps.length - 2 && (
              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className={`px-4 py-2 rounded-md ${
                  isSubmitting || !isValid 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Request'}
              </button>
            )}
            
            {step === steps.length - 1 && (
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Submit Another Request
                </button>
                <button
                  type="button"
                  onClick={handleDone}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Form;