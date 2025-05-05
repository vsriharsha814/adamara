import React, { useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';

const FileUpload = ({ files, setFiles }) => {
  const { formState: { errors } } = useFormContext();
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState('');
  
  // Max file size: 10MB
  const MAX_FILE_SIZE = 10 * 1024 * 1024; 
  // Allowed file types
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
  // Max number of files
  const MAX_FILES = 5;
  
  // Convert bytes to readable format
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };
  
  // Handle file upload
  const handleFileUpload = useCallback((uploadedFiles) => {
    setFileError('');
    
    // Check if adding new files would exceed max
    if (files.length + uploadedFiles.length > MAX_FILES) {
      setFileError(`Maximum ${MAX_FILES} files allowed`);
      return;
    }
    
    // Process each file
    const validFiles = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      
      // Check file type
      if (!ALLOWED_TYPES.includes(file.type)) {
        setFileError('Invalid file type. Only JPEG, PNG, and PDF files are allowed.');
        return;
      }
      
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setFileError(`File too large: ${file.name}. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
        return;
      }
      
      validFiles.push(file);
    }
    
    // Add valid files to state
    setFiles([...files, ...validFiles]);
  }, [files, setFiles]);
  
  // Handle file input change
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };
  
  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // Handle drop event
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };
  
  // Remove file from list
  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  
  // Get file icon based on type
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
  
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">File Upload</h2>
      
      <div className="space-y-4">
        {/* File drag & drop area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="fileUpload"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleChange}
            className="hidden"
          />
          
          <label htmlFor="fileUpload" className="cursor-pointer">
            <div className="flex flex-col items-center justify-center py-3">
              <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-lg font-medium text-gray-700">
                Drag & drop files here, or <span className="text-blue-500">browse</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Accepted file types: JPEG, PNG, PDF (Max: 10MB per file)
              </p>
            </div>
          </label>
        </div>
        
        {/* Error message */}
        {fileError && (
          <div className="p-3 bg-red-100 text-red-700 rounded-md">
            {fileError}
          </div>
        )}
        
        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Uploaded Files ({files.length}/{MAX_FILES})</h3>
            <ul className="border rounded-md divide-y">
              {files.map((file, index) => (
                <li key={index} className="p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    {getFileIcon(file.type)}
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="p-4 bg-gray-50 rounded-md text-sm text-gray-600">
          <h3 className="font-medium text-gray-700 mb-2">File Requirements</h3>
          <ul className="space-y-1 list-disc pl-5">
            <li>Maximum 5 files</li>
            <li>Accepted formats: JPEG, PNG, PDF</li>
            <li>Maximum file size: 10MB per file</li>
            <li>For images: minimum resolution 800x600px recommended</li>
            <li>For PDFs: please ensure all text is readable and images are high-quality</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;