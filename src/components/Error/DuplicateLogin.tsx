import {
    ArrowPathIcon,
    ComputerDesktopIcon,
    DevicePhoneMobileIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useSession from '../../hooks/useSession';

const DuplicateLogin: React.FC = () => {
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { sessionState, isLoading, continueSession, logoutOtherSessions } = useSession();

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <ArrowPathIcon className="w-6 h-6 text-blue-600 animate-spin" />
          <span className="text-gray-600">Loading session information...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Multiple Login Detected
            </h1>
            <p className="text-gray-600">
              It looks like you are already logged in on another device or session.
            </p>
          </div>

          {/* Active Sessions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Sessions
            </h2>
            <div className="space-y-4">
              {sessionState.devices.map((device) => (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center p-4 bg-gray-50 rounded-lg"
                >
                  {device.type === 'mobile' ? (
                    <DevicePhoneMobileIcon className="w-6 h-6 text-gray-400 mr-4" />
                  ) : (
                    <ComputerDesktopIcon className="w-6 h-6 text-gray-400 mr-4" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">{device.name}</p>
                    <p className="text-sm text-gray-500">
                      {device.location} • Last active {device.lastActive}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={continueSession}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Continue Current Session
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={logoutOtherSessions}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Logout Other Sessions
            </motion.button>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowTroubleshooting(!showTroubleshooting)}
                className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
              >
                <QuestionMarkCircleIcon className="w-4 h-4 mr-1" />
                Troubleshooting Tips
              </button>
              <p className="text-sm text-gray-500">
                Try again in {countdown} seconds
              </p>
            </div>
          </div>

          {/* Troubleshooting Tips */}
          <AnimatePresence>
            {showTroubleshooting && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-blue-50 rounded-lg"
              >
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Common Solutions
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Clear your browser cache and cookies</li>
                  <li>• Try logging in from an incognito window</li>
                  <li>• Check if you have multiple browser tabs open</li>
                  <li>• Ensure you're using the correct email address</li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Security Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-gray-600">
                  For security reasons, VeriTrustAI restricts multiple active sessions. 
                  This helps protect your account and sensitive document data.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  All data is encrypted and protected using industry-standard security measures.
                </p>
              </div>
            </div>
          </div>

          {/* Support Link */}
          <div className="mt-6 text-center">
            <Link
              to="/support"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Need help? Contact our support team
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DuplicateLogin; 