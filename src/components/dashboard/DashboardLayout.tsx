import {
    BellIcon,
    ChartBarIcon,
    DocumentIcon,
    HomeIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import React from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Verification', href: '/verification', icon: DocumentIcon },
    { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
    { name: 'Security', href: '/security', icon: ShieldCheckIcon },
    { name: 'Support', href: '/support', icon: QuestionMarkCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isSidebarOpen ? 0 : -300 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg"
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <h1 className="text-xl font-bold text-blue-600">VeriTrustAI</h1>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
        <nav className="mt-5 px-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-blue-600"
            >
              <item.icon
                className="mr-4 h-6 w-6 text-gray-400 group-hover:text-blue-600"
                aria-hidden="true"
              />
              {item.name}
            </a>
          ))}
        </nav>
      </motion.div>

      {/* Main content */}
      <div className={`${isSidebarOpen ? 'ml-64' : 'ml-0'} transition-margin duration-300`}>
        <header className="bg-white shadow">
          <div className="flex h-16 items-center justify-between px-4">
            <h2 className="text-2xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <BellIcon className="h-6 w-6 text-gray-600" />
              </button>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                <UserIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 