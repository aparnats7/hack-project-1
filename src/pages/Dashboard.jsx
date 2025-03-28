import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { DocumentCard } from '@/components/dashboard/DocumentCard';
import { UploadDocumentDialog } from '@/components/dashboard/UploadDocumentDialog';
import { ProfileSection } from '@/components/dashboard/ProfileSection';
import { Plus, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  getDocuments,
  uploadDocument,
  deleteDocument,
  downloadDocument,
  getDocumentById
} from '@/services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch documents on mount and when search query changes
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setLoading(true);
        const response = await getDocuments(searchQuery);
        setDocuments(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch documents. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [searchQuery, toast]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async (formData) => {
    try {
      const response = await uploadDocument(formData);
      setDocuments([response.data, ...documents]);
      toast({
        title: 'Success',
        description: 'Document uploaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to upload document. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDocumentAction = (action, document) => async () => {
    try {
      switch (action) {
        case 'view':
          const response = await getDocumentById(document.id);
          // TODO: Implement document viewer
          console.log('Document details:', response.data);
          break;
        case 'download':
          const blob = await downloadDocument(document.id);
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = document.title;
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          break;
        case 'delete':
          await deleteDocument(document.id);
          setDocuments(documents.filter((doc) => doc.id !== document.id));
          toast({
            title: 'Success',
            description: 'Document deleted successfully',
          });
          break;
        default:
          break;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} document. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile */}
          <div className="md:col-span-1">
            <ProfileSection onLogout={handleLogout} />
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setIsUploadDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Upload Document
              </Button>
            </div>

            {/* Documents Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onView={handleDocumentAction('view', document)}
                    onDownload={handleDocumentAction('download', document)}
                    onDelete={handleDocumentAction('delete', document)}
                  />
                ))}
                {documents.length === 0 && !loading && (
                  <div className="col-span-full text-center py-12 text-gray-500">
                    No documents found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Dialog */}
      <UploadDocumentDialog
        open={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
