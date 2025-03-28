import { useState } from 'react';
import DocumentList from '../components/DocumentList';
import FileUpload from '../components/FileUpload';
import './DocumentsPage.css';

const DocumentsPage = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    // You can add a toast notification here if you have one
  };

  return (
    <div className="documents-page">
      <div className="documents-header">
        <h1>Document Management</h1>
        <p>Upload and manage your documents securely</p>
      </div>

      <div className="documents-content">
        <div className="upload-section">
          <h2>Upload New Document</h2>
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            onUploadError={handleUploadError}
          />
        </div>

        <div className="list-section">
          <DocumentList key={refreshKey} />
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage; 