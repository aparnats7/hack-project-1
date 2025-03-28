import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            const userData = await authAPI.verifyToken();
            setAuthState({
              isAuthenticated: true,
              isLoading: false,
              user: userData,
            });
          } catch (error) {
            // Token is invalid or expired
            localStorage.removeItem('authToken');
            setAuthState({
              isAuthenticated: false,
              isLoading: false,
              user: null,
            });
            navigate('/login');
          }
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await authAPI.login(email, password);
      localStorage.setItem('authToken', token);
      
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user,
      });

      navigate('/dashboard');
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });
    navigate('/login');
  };

  return {
    ...authState,
    login,
    logout,
  };
}; 