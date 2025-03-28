import {
    BellIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ClockIcon,
    DocumentArrowUpIcon,
    MoonIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
    SunIcon,
    UserCircleIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { documentAPI } from '../../services/api';
import APITest from '../Test/APITest';

interface VerificationStatus {
  id: string;
  documentName: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  message?: string;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  date: string;
  read: boolean;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [recentVerifications, setRecentVerifications] = useState<VerificationStatus[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [verificationsData, notificationsData] = await Promise.all([
          documentAPI.getRecentVerifications(),
          documentAPI.getNotifications(),
        ]);
        setRecentVerifications(verificationsData);
        setNotifications(notificationsData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchData, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setError(null);
      const result = await documentAPI.uploadDocument(file);
      setRecentVerifications(prev => [result, ...prev]);
      setNotifications(prev => [{
        id: Date.now().toString(),
        type: 'info',
        message: `Document "${file.name}" uploaded successfully`,
        date: new Date().toISOString(),
        read: false,
      }, ...prev]);
    } catch (err) {
      setError('Failed to upload document');
      console.error('Error uploading document:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20';
      case 'rejected':
        return 'text-red-600 bg-red-50 dark:bg-red-900/20';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5" />;
      case 'rejected':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const quickLinks = [
    { name: 'Profile', icon: UserCircleIcon, path: '/profile' },
    { name: 'Analytics', icon: ChartBarIcon, path: '/analytics' },
    { name: 'Security', icon: ShieldCheckIcon, path: '/security' },
    { name: 'Support', icon: QuestionMarkCircleIcon, path: '/support' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Welcome back, {user?.name || 'User'}
              </h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {isDarkMode ? (
                    <SunIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  ) : (
                    <MoonIcon className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <BellIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  {notifications.some(n => !n.read) && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <button
                  onClick={logout}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Add API Test component in development */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-8">
              <APITest />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upload Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Document Verification
                  </h2>
                  <label className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
                    {isUploading ? 'Uploading...' : 'Upload Document'}
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && !isUploading) {
                          handleFileUpload(file);
                        }
                      }}
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={isUploading}
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Upload your documents for AI-powered verification. We support
                  passports, driver's licenses, and bank statements.
                </p>
              </motion.div>

              {/* Recent Verifications */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Recent Verifications
                </h2>
                <div className="space-y-4">
                  {recentVerifications.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                      No recent verifications found.
                    </p>
                  ) : (
                    recentVerifications.map((verification) => (
                      <div
                        key={verification.id}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${getStatusColor(verification.status)}`}>
                            {getStatusIcon(verification.status)}
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {verification.documentName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(verification.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(verification.status)}`}
                        >
                          {verification.status.charAt(0).toUpperCase() + verification.status.slice(1)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-8">
              {/* Notifications Panel */}
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
                >
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Notifications
                  </h2>
                  <div className="space-y-4">
                    {notifications.length === 0 ? (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg ${
                            notification.read
                              ? 'bg-gray-50 dark:bg-gray-700/50'
                              : 'bg-blue-50 dark:bg-blue-900/20'
                          }`}
                        >
                          <p className="text-sm text-gray-900 dark:text-white">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {new Date(notification.date).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* Quick Links */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
              >
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Quick Links
                </h2>
                <div className="space-y-4">
                  {quickLinks.map((link) => (
                    <button
                      key={link.name}
                      className="w-full flex items-center p-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <link.icon className="w-5 h-5 mr-3 text-blue-600 dark:text-blue-400" />
                      <span>{link.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard; 