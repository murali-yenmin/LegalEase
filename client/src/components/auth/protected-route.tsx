import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "wouter";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  fallback?: string;
}

export const ProtectedRoute = ({ 
  children, 
  roles = [], 
  fallback = "/login" 
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={fallback} replace />;
  }

  if (roles.length > 0 && !hasRole(roles)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
