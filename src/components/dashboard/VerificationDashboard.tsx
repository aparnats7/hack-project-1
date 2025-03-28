import {
    ArrowRightIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentArrowUpIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useVerification from '../../hooks/useVerification';

const VerificationDashboard: React.FC = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const { verificationState, isLoading, handleDocumentUpload, handleVerificationComplete } = useVerification();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <ClockIcon className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="text-gray-600">Loading verification status...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to VeriTrustAI
              </h1>
              <p className="mt-2 text-gray-600">
                Let's get started with your document verification process.
              </p>
            </div>
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <QuestionMarkCircleIcon className="w-5 h-5 mr-2" />
              How it works
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Verification Steps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Verification Steps
              </h2>
              <div className="space-y-6">
                {verificationState.steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.status === 'complete'
                          ? 'bg-green-100 text-green-600'
                          : step.status === 'current'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {step.status === 'complete' ? (
                        <CheckCircleIcon className="w-5 h-5" />
                      ) : step.status === 'current' ? (
                        <DocumentArrowUpIcon className="w-5 h-5" />
                      ) : (
                        <ClockIcon className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        {step.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {step.description}
                      </p>
                    </div>
                    {step.status === 'current' && (
                      <Link
                        to="/upload"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700"
                      >
                        Start
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Security Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Security Assurance
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Your documents are encrypted and processed securely using
                  industry-standard security measures.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">
                    Supported Documents
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Passport</li>
                    <li>• Driver's License</li>
                    <li>• National ID</li>
                    <li>• Bank Statement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Modal */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    How Document Verification Works
                  </h3>
                  <button
                    onClick={() => setShowTutorial(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Close</span>
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Our AI-powered verification process ensures the authenticity
                    and validity of your documents in three simple steps:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600">
                    <li>Upload your identity document</li>
                    <li>Our AI system analyzes and verifies the document</li>
                    <li>Receive confirmation of successful verification</li>
                  </ol>
                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <p className="text-sm text-blue-800">
                      Your documents are encrypted and processed securely. We never
                      store sensitive information on our servers.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VerificationDashboard; 