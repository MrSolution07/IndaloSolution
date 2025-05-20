import React from 'react';
import { Redirect, Route, useLocation } from 'wouter';
import { useAuth, UserRole } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  requiredRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  path,
  component: Component,
  requiredRoles
}) => {
  const { user, isLoading, verifyRole } = useAuth();
  const [, setLocation] = useLocation();

  // Create a wrapper component to render
  const WrappedComponent = (props: any) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!user) {
      return <Redirect to="/login" />;
    }

    if (requiredRoles && !verifyRole(requiredRoles)) {
      return (
        <div className="container mx-auto py-12 px-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
            <h2 className="text-2xl font-semibold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-6">
              You don't have the required permissions to access this page.
            </p>
            <button
              onClick={() => setLocation('/')}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };

  return <Route path={path} component={WrappedComponent} />;
};

export default ProtectedRoute;