import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VerificationState {
  currentStep: number;
  steps: {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'current' | 'complete';
  }[];
  documents: {
    id: string;
    type: string;
    status: 'pending' | 'processing' | 'verified' | 'rejected';
    uploadedAt: Date;
  }[];
}

const useVerification = () => {
  const [verificationState, setVerificationState] = useState<VerificationState>({
    currentStep: 0,
    steps: [
      {
        id: 'upload',
        title: 'Upload Documents',
        description: 'Upload your identity documents for verification',
        status: 'current',
      },
      {
        id: 'verification',
        title: 'AI Verification',
        description: 'Our AI system verifies your documents',
        status: 'pending',
      },
      {
        id: 'complete',
        title: 'Verification Complete',
        description: 'Receive confirmation of successful verification',
        status: 'pending',
      },
    ],
    documents: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch verification status from backend
  const fetchVerificationStatus = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/verification/status');
      const data = await response.json();
      setVerificationState(data);
    } catch (error) {
      console.error('Error fetching verification status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('document', file);

      // Replace with actual API call
      const response = await fetch('/api/verification/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setVerificationState((prev) => ({
        ...prev,
        documents: [...prev.documents, data],
      }));

      // Move to next step
      setVerificationState((prev) => ({
        ...prev,
        currentStep: prev.currentStep + 1,
        steps: prev.steps.map((step, index) => ({
          ...step,
          status:
            index === prev.currentStep + 1
              ? 'current'
              : index < prev.currentStep + 1
              ? 'complete'
              : 'pending',
        })),
      }));
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  // Handle verification completion
  const handleVerificationComplete = async () => {
    try {
      // Replace with actual API call
      await fetch('/api/verification/complete', {
        method: 'POST',
      });

      // Update final step status
      setVerificationState((prev) => ({
        ...prev,
        steps: prev.steps.map((step, index) => ({
          ...step,
          status: index === prev.steps.length - 1 ? 'complete' : step.status,
        })),
      }));

      // Navigate to success page
      navigate('/verification-success');
    } catch (error) {
      console.error('Error completing verification:', error);
      throw error;
    }
  };

  // Fetch initial status on mount
  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  return {
    verificationState,
    isLoading,
    handleDocumentUpload,
    handleVerificationComplete,
  };
};

export default useVerification; 