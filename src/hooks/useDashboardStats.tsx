import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      // Fetch all counts in parallel
      const [clientsRes, employeesRes, invoicesRes, projectsRes] = await Promise.all([
        supabase.from("clients").select("*", { count: "exact", head: true }),
        supabase.from("employees").select("*", { count: "exact", head: true }),
        supabase.from("invoices").select("total_amount, status"),
        supabase.from("projects").select("status")
      ]);

      // Calculate total invoice amount
      const totalInvoice = invoicesRes.data?.reduce((sum, inv) => sum + (inv.total_amount || 0), 0) || 0;

      // Count active projects
      const activeProjects = projectsRes.data?.filter(p => p.status === "in_progress").length || 0;

      return {
        clients: clientsRes.count || 0,
        employees: employeesRes.count || 0,
        invoiceTotal: totalInvoice,
        activeProjects
      };
    }
  });
}

export function useLeadsPipelineData() {
  return useQuery({
    queryKey: ["leads-pipeline"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("stage, estimated_value");

      if (error) throw error;

      const pipelineData = {
        new: { count: 0, value: 0 },
        contacted: { count: 0, value: 0 },
        proposal: { count: 0, value: 0 },
        negotiation: { count: 0, value: 0 },
        won: { count: 0, value: 0 }
      };

      data?.forEach(lead => {
        const stage = lead.stage || "new";
        if (stage in pipelineData) {
          pipelineData[stage as keyof typeof pipelineData].count++;
          pipelineData[stage as keyof typeof pipelineData].value += lead.estimated_value || 0;
        }
      });

      return pipelineData;
    }
  });
}
