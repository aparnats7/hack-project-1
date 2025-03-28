import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Device {
  id: string;
  name: string;
  type: 'mobile' | 'desktop';
  location: string;
  lastActive: string;
}

interface SessionState {
  isActive: boolean;
  devices: Device[];
  lastActivity: Date;
}

const useSession = () => {
  const [sessionState, setSessionState] = useState<SessionState>({
    isActive: false,
    devices: [],
    lastActivity: new Date(),
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Mock function to fetch active sessions from backend
  const fetchActiveSessions = async () => {
    try {
      // Replace with actual API call
      const response = await fetch('/api/sessions');
      const data = await response.json();
      setSessionState(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle session continuation
  const continueSession = async () => {
    try {
      // Replace with actual API call
      await fetch('/api/sessions/continue', {
        method: 'POST',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Error continuing session:', error);
    }
  };

  // Handle logging out other sessions
  const logoutOtherSessions = async () => {
    try {
      // Replace with actual API call
      await fetch('/api/sessions/logout-others', {
        method: 'POST',
      });
      navigate('/login');
    } catch (error) {
      console.error('Error logging out other sessions:', error);
    }
  };

  // Update last activity
  const updateLastActivity = () => {
    setSessionState((prev) => ({
      ...prev,
      lastActivity: new Date(),
    }));
  };

  // Track user activity
  useEffect(() => {
    const handleActivity = () => {
      updateLastActivity();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, []);

  // Fetch active sessions on mount
  useEffect(() => {
    fetchActiveSessions();
  }, []);

  return {
    sessionState,
    isLoading,
    continueSession,
    logoutOtherSessions,
  };
};

export default useSession; 