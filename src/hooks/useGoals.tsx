import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Goal {
  id: string;
  employee_id: string;
  title: string;
  description: string | null;
  target_value: number | null;
  current_value: number;
  unit: string | null;
  start_date: string;
  end_date: string;
  status: string;
  priority: string;
  created_at: string;
  employee?: { full_name: string };
}

export const useGoals = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('goals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'goals' }, () => {
        queryClient.invalidateQueries({ queryKey: ['goals'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['goals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('goals')
        .select(`*, employee:employees(full_name)`)
        .order('end_date', { ascending: true });
      if (error) throw error;
      return data as Goal[];
    },
  });
};
