import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import PostSignupPage from './PostSignupPage';
import DocumentUpload from './DocumentUpload';
import SecurityInfo from './SecurityInfo';
import { Button } from '@/components/ui/button';

const PostSignupLayout = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeTab, setActiveTab] = useState('verification');

  const tabs = [
    { id: 'verification', label: 'Verification' },
    { id: 'security', label: 'Security' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'verification':
        return (
          <div className="space-y-6">
            <PostSignupPage />
            <DocumentUpload 
              onFileSelect={(file) => {
                console.log('File selected:', file);
                // Handle file upload here
              }}
              onRemove={() => {
                console.log('File removed');
                // Handle file removal here
              }}
            />
          </div>
        );
      case 'security':
        return <SecurityInfo />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden border-b">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
          >
            {showSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          <h1 className="text-xl font-semibold">VeriTrustAI</h1>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out
            ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0 lg:static
          `}
        >
          <div className="h-full flex flex-col">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Verification Process</h2>
            </div>
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? 'secondary' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setShowSidebar(false);
                    }}
                  >
                    {tab.label}
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </div>
  );
};

export default PostSignupLayout; 