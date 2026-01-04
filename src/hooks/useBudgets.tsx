import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Budget {
  id: string;
  project_id: string;
  category: string;
  allocated_amount: number;
  spent_amount: number;
  notes: string | null;
  created_at: string;
  project?: { name: string };
}

export const useBudgets = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('budgets-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_budgets' }, () => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['budgets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_budgets')
        .select(`*, project:projects(name)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Budget[];
    },
  });
};
