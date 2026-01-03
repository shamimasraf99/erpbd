import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Lead {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  estimated_value: number | null;
  source: string | null;
  stage: string | null;
  notes: string | null;
  created_at: string;
}

export function useLeads() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('leads-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        queryClient.invalidateQueries({ queryKey: ["leads"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
}

export function useLeadsByStage() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('leads-stage-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        queryClient.invalidateQueries({ queryKey: ["leads-by-stage"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["leads-by-stage"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("stage")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const stageCounts = {
        new: 0,
        contacted: 0,
        proposal: 0,
        negotiation: 0,
        won: 0
      };

      data?.forEach(lead => {
        const stage = lead.stage || "new";
        if (stage in stageCounts) {
          stageCounts[stage as keyof typeof stageCounts]++;
        }
      });

      return stageCounts;
    }
  });
}
