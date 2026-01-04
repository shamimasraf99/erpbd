import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'admin' | 'manager' | 'employee' | 'user';

export function useUserRole() {
  const { user } = useAuth();
  
  const { data: role, isLoading } = useQuery({
    queryKey: ['userRole', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user role:', error);
        return 'user' as AppRole;
      }
      return (data?.role || 'user') as AppRole;
    },
    enabled: !!user,
  });
  
  return {
    role: role || 'user' as AppRole,
    isLoading,
    isAdmin: role === 'admin',
    isManager: role === 'manager' || role === 'admin',
    isEmployee: role === 'employee' || role === 'manager' || role === 'admin',
    canManageUsers: role === 'admin',
    canManageEmployees: role === 'admin' || role === 'manager',
    canViewFinancials: role === 'admin' || role === 'manager',
    canUsePOS: role === 'admin' || role === 'manager' || role === 'employee',
  };
}
