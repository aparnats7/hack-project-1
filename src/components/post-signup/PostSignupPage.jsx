import { useState } from 'react';
import { Upload, Shield, CheckCircle, AlertCircle, Clock, SkipForward } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PostSignupPage = () => {
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [documentUploaded, setDocumentUploaded] = useState(false);

  const handleFileUpload = (file) => {
    setDocumentUploaded(true);
    // Here you would typically handle the file upload to your backend
    // For now, we'll just simulate the upload
    setTimeout(() => {
      setVerificationStatus('processing');
    }, 1000);
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">Verify Your Identity</h1>
        <p className="text-muted-foreground">
          Upload your document to complete your verification process
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Security Assurance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-muted p-4 rounded-lg flex items-start space-x-4"
        >
          <Shield className="h-5 w-5 text-primary mt-1" />
          <div>
            <h3 className="font-semibold mb-1">Secure Document Processing</h3>
            <p className="text-sm text-muted-foreground">
              Your documents are encrypted and processed securely. We only use them for verification purposes.
            </p>
          </div>
        </motion.div>

        {/* Document Upload Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border-2 border-dashed rounded-lg p-8 text-center"
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Upload Your Document</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Supported formats: Passport, Driver's License, National ID (PDF, JPG, PNG)
          </p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e.target.files[0])}
            className="hidden"
            id="document-upload"
          />
          <label
            htmlFor="document-upload"
            className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer hover:bg-primary/90 transition-colors"
          >
            Choose File
          </label>
        </motion.div>

        {/* Verification Status */}
        <AnimatePresence>
          {documentUploaded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-muted p-4 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                {verificationStatus === 'processing' ? (
                  <>
                    <Clock className="h-5 w-5 text-primary animate-spin" />
                    <div>
                      <h3 className="font-semibold">Verification in Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Our AI is analyzing your document. This may take a few minutes.
                      </p>
                    </div>
                  </>
                ) : verificationStatus === 'complete' ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <h3 className="font-semibold">Verification Complete</h3>
                      <p className="text-sm text-muted-foreground">
                        Your document has been successfully verified.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <h3 className="font-semibold">Verification Pending</h3>
                      <p className="text-sm text-muted-foreground">
                        Please upload your document to begin verification.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skip Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button
            variant="ghost"
            onClick={handleSkip}
            className="text-muted-foreground hover:text-primary"
          >
            <SkipForward className="h-4 w-4 mr-2" />
            Skip for Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default PostSignupPage; 