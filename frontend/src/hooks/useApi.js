import { useCallback, useState } from 'react';
import { handleAPIError } from '../services/api';

export const useApi = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...params) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...params);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorData = handleAPIError(err);
      setError(errorData);
      throw errorData;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return {
    data,
    loading,
    error,
    execute,
  };
};

// Example usage:
/*
const { data, loading, error, execute } = useApi(authAPI.login);

// In your component:
const handleLogin = async (credentials) => {
  try {
    await execute(credentials);
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};
*/ 