import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Contract {
  id: string;
  contract_number: string;
  title: string;
  client_id: string | null;
  project_id: string | null;
  start_date: string;
  end_date: string | null;
  value: number;
  terms: string | null;
  status: string;
  signed_by_client: boolean;
  signed_by_company: boolean;
  client_signature_date: string | null;
  company_signature_date: string | null;
  document_url: string | null;
  created_at: string;
  client?: { name: string; company: string };
  project?: { name: string };
}

export const useContracts = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('contracts-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contracts' }, () => {
        queryClient.invalidateQueries({ queryKey: ['contracts'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contracts')
        .select(`*, client:clients(name, company), project:projects(name)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Contract[];
    },
  });
};
