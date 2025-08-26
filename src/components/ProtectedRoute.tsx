import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'admin' | 'moderator' | 'user';
}

export function ProtectedRoute({ 
  children, 
  requireAuth = true,
  requiredRole 
}: ProtectedRouteProps) {
  const { user, loading, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        navigate("/auth");
        return;
      }

      if (requiredRole && user && !hasRole(requiredRole)) {
        navigate("/");
        return;
      }
    }
  }, [user, loading, requireAuth, requiredRole, hasRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requiredRole && user && !hasRole(requiredRole)) {
    return null;
  }

  return <>{children}</>;
}