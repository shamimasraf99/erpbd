import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Invoice {
  id: string;
  invoice_number: string;
  client_id: string | null;
  client_name?: string;
  project_id: string | null;
  project_name?: string;
  amount: number;
  tax_amount: number | null;
  total_amount: number;
  issue_date: string;
  due_date: string;
  status: string | null;
  notes: string | null;
}

export function useInvoices() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('invoices-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => {
        queryClient.invalidateQueries({ queryKey: ["invoices"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data: invoices, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch clients and projects for names
      const { data: clients } = await supabase
        .from("clients")
        .select("id, name");

      const { data: projects } = await supabase
        .from("projects")
        .select("id, name");

      const clientMap = new Map(clients?.map(c => [c.id, c.name]) || []);
      const projectMap = new Map(projects?.map(p => [p.id, p.name]) || []);

      return (invoices || []).map(inv => ({
        ...inv,
        client_name: inv.client_id ? clientMap.get(inv.client_id) : null,
        project_name: inv.project_id ? projectMap.get(inv.project_id) : null
      }));
    }
  });
}

export function useInvoiceStats() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('invoices-stats-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'invoices' }, () => {
        queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["invoice-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invoices")
        .select("total_amount, status");

      if (error) throw error;

      const stats = {
        total: 0,
        paid: 0,
        pending: 0,
        overdue: 0
      };

      data?.forEach(inv => {
        const amount = inv.total_amount || 0;
        stats.total += amount;
        
        switch (inv.status) {
          case "paid":
            stats.paid += amount;
            break;
          case "pending":
            stats.pending += amount;
            break;
          case "overdue":
            stats.overdue += amount;
            break;
        }
      });

      return stats;
    }
  });
}
