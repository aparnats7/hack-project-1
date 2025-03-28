import { useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { documentsAPI } from '../services/api';
import './DocumentList.css';

const DocumentList = () => {
  const { data: documents, loading, error, execute: fetchDocuments } = useApi(documentsAPI.getDocuments);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (documentId) => {
    try {
      await documentsAPI.deleteDocument(documentId);
      fetchDocuments(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleDownload = async (documentId, fileName) => {
    try {
      const response = await documentsAPI.downloadDocument(documentId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading documents...</div>;
  }

  if (error) {
    return <div className="error">Error loading documents: {error.message}</div>;
  }

  if (!documents || documents.length === 0) {
    return <div className="no-documents">No documents uploaded yet.</div>;
  }

  return (
    <div className="document-list">
      <h2>Uploaded Documents</h2>
      <div className="documents-grid">
        {documents.map((doc) => (
          <div key={doc._id} className="document-card">
            <div className="document-icon">
              {doc.file_type === 'application/pdf' ? '📄' : '🖼️'}
            </div>
            <div className="document-info">
              <h3>{doc.file_name}</h3>
              <p>Type: {doc.document_type}</p>
              <p>Status: <span className={`status ${doc.status.toLowerCase()}`}>{doc.status}</span></p>
              <p>Uploaded: {new Date(doc.upload_date).toLocaleDateString()}</p>
            </div>
            <div className="document-actions">
              <button
                onClick={() => handleDownload(doc._id, doc.file_name)}
                className="download-btn"
              >
                Download
              </button>
              <button
                onClick={() => handleDelete(doc._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentList; 