import { Navigate, useLocation } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { authAPI } from '../../services/api';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { data: user, loading, error } = useApi(authAPI.getProfile);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !user) {
    // Redirect to login page but save the attempted url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 