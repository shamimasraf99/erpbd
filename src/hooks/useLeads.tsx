import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
