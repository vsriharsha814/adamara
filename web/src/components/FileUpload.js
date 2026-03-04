"use client";

import { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";

export default function FileUpload({ files, setFiles }) {
  useFormContext(); // keep parity with old form (validations live here if needed later)

  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState("");

  // Store lightweight image data directly in Firestore, so we keep
  // strict limits below Firestore's per-document size cap.
  const MAX_FILE_SIZE = 150 * 1024; // 150KB
  const ALLOWED_TYPES = ["image/jpeg", "image/png"];
  const MAX_FILES = 3;

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const handleFileUpload = useCallback(
    (uploadedFiles) => {
      setFileError("");

      if (files.length + uploadedFiles.length > MAX_FILES) {
        setFileError(`Maximum ${MAX_FILES} files allowed`);
        return;
      }

      const validFiles = [];

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];

        if (!ALLOWED_TYPES.includes(file.type)) {
          setFileError("Invalid file type. Only JPEG and PNG images are allowed.");
          return;
        }

        if (file.size > MAX_FILE_SIZE) {
          setFileError(
            `Image too large: ${file.name}. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`
          );
          return;
        }

        validFiles.push(file);
      }

      setFiles([...files, ...validFiles]);
    },
    [files, setFiles]
  );

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType) => {
    if (fileType.includes("image")) {
      return (
        <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      );
    }

    return (
      <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    );
  };

  return (
    <div>
      <h2 className="mb-1 text-xl font-semibold">Images</h2>
      <p className="mb-5 text-sm text-gray-600">
        Upload reference images (logos, layouts, mocks). JPEG/PNG only.
      </p>

      <div className="space-y-4">
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center ${
            dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
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
            accept=".jpg,.jpeg,.png"
            onChange={handleChange}
            className="hidden"
          />

          <label htmlFor="fileUpload" className="cursor-pointer" aria-label="Upload file">
            <div className="flex flex-col items-center justify-center py-3">
              <svg className="mb-2 h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-lg font-medium text-gray-700">
                Drag &amp; drop images, or <span className="text-blue-600">browse</span>
              </p>
              <p className="mt-1 text-sm text-gray-500">
                JPEG/PNG • up to {formatFileSize(MAX_FILE_SIZE)} each • max {MAX_FILES} images
              </p>
            </div>
          </label>
        </div>

        {fileError && <div className="rounded-md bg-red-100 p-3 text-red-700">{fileError}</div>}

        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="mb-2 font-medium">
              Uploaded images ({files.length}/{MAX_FILES})
            </h3>
            <ul className="divide-y rounded-md border">
              {files.map((file, index) => (
                <li key={`${file.name}-${index}`} className="flex items-center justify-between p-3">
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
                    aria-label={`Remove ${file.name}`}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-600">
          <h3 className="mb-2 font-medium text-gray-800">Image requirements</h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Maximum {MAX_FILES} images</li>
            <li>Accepted formats: JPEG, PNG</li>
            <li>Maximum size: {formatFileSize(MAX_FILE_SIZE)} per image</li>
            <li>Use web-ready exports so previews load quickly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

