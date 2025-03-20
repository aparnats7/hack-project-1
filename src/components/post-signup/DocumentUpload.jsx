import { useState, useCallback } from 'react';
import { Upload, X, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

const DocumentUpload = ({ onFileSelect, onRemove }) => {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        setError('Please upload a valid file (JPEG, PNG, or PDF)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      setError(null);
      setPreview(URL.createObjectURL(file));
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onRemove();
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500'}
          ${error ? 'border-red-500 bg-red-50' : ''}`}
      >
        <input {...getInputProps()} />
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg shadow-md"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {isDragActive
                ? 'Drop the file here'
                : 'Drag and drop your document here, or click to select'}
            </p>
            <p className="text-sm text-gray-500">
              Supported formats: JPEG, PNG, PDF (max 5MB)
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
          <X className="w-5 h-5" />
          <span>{error}</span>
        </div>
      )}

      {preview && !error && (
        <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <span>File uploaded successfully</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload; 