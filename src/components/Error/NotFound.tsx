import {
    ArrowPathIcon,
    DocumentTextIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    ShieldCheckIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const popularPages = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'Document Verification', icon: DocumentTextIcon, path: '/verification' },
    { name: 'Profile', icon: UserIcon, path: '/profile' },
    { name: 'Security', icon: ShieldCheckIcon, path: '/security' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Implement search functionality here
    setTimeout(() => setIsSearching(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full text-center"
      >
        {/* 404 Icon */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="mx-auto w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center"
          >
            <span className="text-6xl font-bold text-blue-600">404</span>
          </motion.div>
        </div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Page Not Found
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSearch}
          className="mt-8 max-w-md mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for pages..."
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <button
              type="submit"
              disabled={isSearching}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              {isSearching ? (
                <ArrowPathIcon className="w-5 h-5 animate-spin" />
              ) : (
                'Search'
              )}
            </button>
          </div>
        </motion.form>

        {/* Popular Pages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12"
        >
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Popular Pages
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {popularPages.map((page) => (
              <Link
                key={page.name}
                to={page.path}
                className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <page.icon className="w-6 h-6 text-blue-600 mb-2" />
                <span className="text-sm text-gray-600">{page.name}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound; 