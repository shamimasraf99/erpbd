import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Timesheet {
  id: string;
  employee_id: string;
  project_id: string | null;
  task_id: string | null;
  work_date: string;
  hours_worked: number;
  description: string | null;
  billable: boolean;
  status: string;
  approved_by: string | null;
  created_at: string;
  employee?: { full_name: string };
  project?: { name: string };
  task?: { title: string };
}

export const useTimesheets = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('timesheets-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'timesheets' }, () => {
        queryClient.invalidateQueries({ queryKey: ['timesheets'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['timesheets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timesheets')
        .select(`*, employee:employees!timesheets_employee_id_fkey(full_name), project:projects(name), task:tasks(title)`)
        .order('work_date', { ascending: false });
      if (error) throw error;
      return data as Timesheet[];
    },
  });
};
