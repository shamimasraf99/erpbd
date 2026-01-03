import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Project {
  id: string;
  name: string;
  client_id: string | null;
  client_name?: string;
  description: string | null;
  progress: number | null;
  status: string | null;
  priority: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
}

export function useProjects() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch clients for names
      const { data: clients } = await supabase
        .from("clients")
        .select("id, name");

      const clientMap = new Map(clients?.map(c => [c.id, c.name]) || []);

      return (projects || []).map(proj => ({
        ...proj,
        client_name: proj.client_id ? clientMap.get(proj.client_id) : null
      }));
    }
  });
}

export function useProjectStats() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('projects-stats-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        queryClient.invalidateQueries({ queryKey: ["project-stats"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["project-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("status");

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        planning: 0,
        ongoing: 0,
        completed: 0,
        delayed: 0,
        hold: 0
      };

      data?.forEach(proj => {
        switch (proj.status) {
          case "planning":
            stats.planning++;
            break;
          case "in_progress":
            stats.ongoing++;
            break;
          case "completed":
            stats.completed++;
            break;
          case "delayed":
            stats.delayed++;
            break;
          case "on_hold":
            stats.hold++;
            break;
        }
      });

      return stats;
    }
  });
}
