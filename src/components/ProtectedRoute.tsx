import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole, AppRole } from "@/hooks/useUserRole";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: AppRole;
  allowedRoles?: AppRole[];
}

export function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { role, isLoading: roleLoading } = useUserRole();

  if (isLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check role-based access
  if (requiredRole || allowedRoles) {
    const hasAccess = checkRoleAccess(role, requiredRole, allowedRoles);
    if (!hasAccess) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
}

function checkRoleAccess(
  userRole: AppRole,
  requiredRole?: AppRole,
  allowedRoles?: AppRole[]
): boolean {
  // Admin has access to everything
  if (userRole === 'admin') return true;
  
  // Check allowed roles list
  if (allowedRoles && allowedRoles.length > 0) {
    return allowedRoles.includes(userRole);
  }
  
  // Check required role hierarchy
  if (requiredRole) {
    const roleHierarchy: Record<AppRole, number> = {
      'admin': 4,
      'manager': 3,
      'employee': 2,
      'user': 1,
    };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }
  
  return true;
}
