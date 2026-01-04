import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface AccountingEntry {
  id: string;
  entry_date: string;
  entry_type: string;
  account_name: string;
  debit: number;
  credit: number;
  reference_type: string | null;
  reference_id: string | null;
  description: string | null;
  created_by: string | null;
  created_at: string;
}

export const useAccounting = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('accounting-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'accounting_entries' }, () => {
        queryClient.invalidateQueries({ queryKey: ['accounting'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['accounting'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accounting_entries')
        .select('*')
        .order('entry_date', { ascending: false });
      if (error) throw error;
      return data as AccountingEntry[];
    },
  });
};
