import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  title: string;
  path: string;
  description: string;
}

const useSearch = () => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // Mock search results - replace with actual API call
  const searchResults: SearchResult[] = [
    {
      title: 'Document Verification',
      path: '/verification',
      description: 'Upload and verify your documents',
    },
    {
      title: 'Dashboard',
      path: '/dashboard',
      description: 'View your verification status and analytics',
    },
    {
      title: 'Support',
      path: '/support',
      description: 'Get help with document verification',
    },
  ];

  const handleSearch = useCallback(
    (searchQuery: string) => {
      setIsSearching(true);
      setQuery(searchQuery);

      // Simulate API call delay
      setTimeout(() => {
        const results = searchResults.filter((result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (results.length > 0) {
          // Navigate to the first matching result
          navigate(results[0].path);
        }
        setIsSearching(false);
      }, 500);
    },
    [navigate]
  );

  return {
    query,
    isSearching,
    handleSearch,
  };
};

export default useSearch; 