import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();

  // Se não está logado, redireciona pro login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se precisa ser admin mas não é, redireciona pro dashboard
  if (requiredRole === 'admin' && user.role !== 'admin') {
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;