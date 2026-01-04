import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Deal {
  id: string;
  title: string;
  client_id: string | null;
  lead_id: string | null;
  amount: number;
  stage: string;
  probability: number;
  expected_close_date: string | null;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  client?: { name: string; company: string };
  assignee?: { full_name: string };
}

export const useDeals = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('deals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'deals' }, () => {
        queryClient.invalidateQueries({ queryKey: ['deals'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('deals')
        .select(`*, client:clients(name, company), assignee:employees!deals_assigned_to_fkey(full_name)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Deal[];
    },
  });
};
