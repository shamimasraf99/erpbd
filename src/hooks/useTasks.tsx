import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  priority: string | null;
  due_date: string | null;
  assigned_to: string | null;
  project_id: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  project?: { name: string } | null;
}

export function useTodayTasks() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('tasks-today-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        queryClient.invalidateQueries({ queryKey: ["today-tasks"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["today-tasks"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          project:projects(name)
        `)
        .or(`due_date.eq.${today},due_date.is.null`)
        .order("priority", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data as Task[];
    }
  });
}

export function useToggleTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { error } = await supabase
        .from("tasks")
        .update({
          status: isCompleted ? "completed" : "pending",
          completed_at: isCompleted ? new Date().toISOString() : null
        })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["today-tasks"] });
    }
  });
}
