import { CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react';

interface WelcomeSectionProps {
  userName: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  onStartVerification: () => void;
  onContinueVerification: () => void;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName,
  verificationStatus,
  onStartVerification,
  onContinueVerification,
}) => {
  const getStatusIcon = () => {
    switch (verificationStatus) {
      case 'verified':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusColor = () => {
    switch (verificationStatus) {
      case 'verified':
        return 'bg-green-50 text-green-700';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-yellow-50 text-yellow-700';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm p-6 mb-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {userName}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Secure AI-Driven Document Verification Platform
          </p>
        </div>
        <div className={`flex items-center px-3 py-1 rounded-full ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="ml-2 text-sm font-medium capitalize">
            {verificationStatus}
          </span>
        </div>
      </div>

      <div className="mt-6 flex space-x-4">
        <button
          onClick={onStartVerification}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Verify Your Identity Now
        </button>
        <button
          onClick={onContinueVerification}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Continue Verification
        </button>
      </div>
    </motion.div>
  );
};

export default WelcomeSection; 