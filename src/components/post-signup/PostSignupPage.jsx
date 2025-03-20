import { useState } from 'react';
import { Upload, Camera, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PostSignupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [profileCompletion, setProfileCompletion] = useState(60);

  const steps = [
    {
      id: 1,
      title: "Welcome to VeriTrustAI!",
      subtitle: "Let's get started with secure document verification",
      component: <WelcomeStep onNext={() => setCurrentStep(2)} />
    },
    {
      id: 2,
      title: "Verify Your Identity",
      subtitle: "Upload your identity document securely",
      component: <DocumentUploadStep onNext={() => setCurrentStep(3)} />
    },
    {
      id: 3,
      title: "Verification Status",
      subtitle: "Track your verification progress",
      component: <DashboardStep status={verificationStatus} />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 ? 'flex-1' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {steps[currentStep - 1].subtitle}
            </p>
            {steps[currentStep - 1].component}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Step 1: Welcome Component
const WelcomeStep = ({ onNext }) => (
  <div className="text-center">
    <div className="mb-8">
      <img
        src="/illustrations/security-illustration.svg"
        alt="Security Illustration"
        className="w-64 mx-auto"
      />
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-8">
      We ensure secure and AI-powered document verification for seamless authentication.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={onNext}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Start Verification
      </button>
      <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
        Explore Dashboard
      </button>
    </div>
  </div>
);

// Step 2: Document Upload Component
const DocumentUploadStep = ({ onNext }) => (
  <div>
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center mb-6">
      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Drag and drop your document here, or
      </p>
      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
        Browse Files
      </button>
      <p className="text-sm text-gray-500 mt-4">
        Supported formats: JPEG, PNG, PDF
      </p>
    </div>
    
    <div className="flex items-center justify-center gap-4 mb-6">
      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
        <Camera className="w-5 h-5" />
        Use Camera
      </button>
    </div>

    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
      <p className="text-sm text-blue-700 dark:text-blue-300">
        Your documents are encrypted and processed securely with AI.
      </p>
    </div>

    <button
      onClick={onNext}
      className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      Submit for Verification
    </button>
  </div>
);

// Step 3: Dashboard Component
const DashboardStep = ({ status }) => (
  <div>
    <div className="bg-white dark:bg-gray-700 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-4 mb-4">
        {status === 'approved' && <CheckCircle className="w-8 h-8 text-green-500" />}
        {status === 'pending' && <Clock className="w-8 h-8 text-yellow-500" />}
        {status === 'rejected' && <AlertCircle className="w-8 h-8 text-red-500" />}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Verification Status: {status.charAt(0).toUpperCase() + status.slice(1)}
        </h3>
      </div>
      
      {status === 'pending' && (
        <p className="text-gray-600 dark:text-gray-300">
          Your document verification is in progress. You'll receive an update shortly.
        </p>
      )}
    </div>

    <div className="mb-6">
      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Profile Completion
      </h4>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${profileCompletion}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
        {profileCompletion}% Complete
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
        View FAQs
      </button>
      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
        Contact Support
      </button>
    </div>
  </div>
);

export default PostSignupPage; 