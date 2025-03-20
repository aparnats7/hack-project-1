import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import PostSignupPage from './PostSignupPage';
import DocumentUpload from './DocumentUpload';
import VerificationStatus from './VerificationStatus';
import SecurityInfo from './SecurityInfo';
import UserSupport from './UserSupport';
import NotificationsPanel from './NotificationsPanel';
import Settings from './Settings';

const PostSignupLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('verification');

  const tabs = [
    { id: 'verification', label: 'Verification' },
    { id: 'security', label: 'Security' },
    { id: 'support', label: 'Support' },
    { id: 'settings', label: 'Settings' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'verification':
        return (
          <div className="space-y-6">
            <PostSignupPage />
            <DocumentUpload onFileSelect={() => {}} onRemove={() => {}} />
            <VerificationStatus status="pending" progress={1} lastUpdated="2 minutes ago" />
          </div>
        );
      case 'security':
        return <SecurityInfo />;
      case 'support':
        return <UserSupport />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="text-gray-600 dark:text-gray-300"
          >
            {showSidebar ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            VeriTrustAI
          </h1>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                VeriTrustAI
              </h1>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setShowSidebar(false);
                  }}
                  className={`w-full px-4 py-2 text-left rounded-lg transition-colors
                    ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <NotificationsPanel />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default PostSignupLayout; 