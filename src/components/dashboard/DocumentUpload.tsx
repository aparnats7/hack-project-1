import { DocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface DocumentUploadProps {
  onUpload: (file: File) => void;
  acceptedFileTypes: string[];
  maxFileSize: number;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  onUpload,
  acceptedFileTypes,
  maxFileSize,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > maxFileSize) {
          setError(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`);
          return;
        }

        // Create preview URL
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setError(null);
        onUpload(file);
      }
    },
    [maxFileSize, onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: 1,
  });

  const removeFile = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm p-6 mb-6"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Upload Document
      </h2>
      
      {preview ? (
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Document preview"
              className="object-contain w-full h-full"
            />
          </div>
          <button
            onClick={removeFile}
            className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-50"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-blue-500'
          }`}
        >
          <input {...getInputProps()} />
          <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? 'Drop the file here'
              : 'Drag and drop a file here, or click to select'}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: {acceptedFileTypes.join(', ')}
          </p>
        </div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default DocumentUpload; 