import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Estimate {
  id: string;
  estimate_number: string;
  client_id: string | null;
  title: string;
  description: string | null;
  items: any[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  valid_until: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  client?: { name: string; company: string };
}

export const useEstimates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('estimates-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'estimates' }, () => {
        queryClient.invalidateQueries({ queryKey: ['estimates'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['estimates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('estimates')
        .select(`*, client:clients(name, company)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Estimate[];
    },
  });
};
