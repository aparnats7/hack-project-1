import { useRef, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { documentsAPI } from '../services/api';

const MAX_FILE_SIZE = 16 * 1024 * 1024; // 16MB
const ALLOWED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

const FileUpload = ({ onUploadSuccess, onUploadError }) => {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const { loading, execute: uploadFile } = useApi(documentsAPI.uploadDocument);

  const validateFile = (file) => {
    if (!file) {
      setError('Please select a file');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds 16MB limit');
      return false;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Invalid file type. Allowed types: PDF, PNG, JPEG');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !validateFile(selectedFile)) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('document_type', 'general'); // You can make this dynamic
      formData.append('description', ''); // You can make this dynamic

      const response = await uploadFile(formData);
      onUploadSuccess?.(response);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      onUploadError?.(error);
    }
  };

  return (
    <div className="file-upload">
      <div className="file-input-container">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept={ALLOWED_TYPES.join(',')}
          className="file-input"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="select-file-btn"
        >
          Select File
        </button>
      </div>

      {selectedFile && (
        <div className="file-info">
          <p>Selected file: {selectedFile.name}</p>
          <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          <p>Type: {selectedFile.type}</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {selectedFile && !error && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="upload-btn"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      )}
    </div>
  );
};

export default FileUpload; 