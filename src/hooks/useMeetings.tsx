import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Meeting {
  id: string;
  title: string;
  description: string | null;
  meeting_type: string | null;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  location: string | null;
  meeting_link: string | null;
  organizer_id: string | null;
  created_at: string;
  updated_at: string;
  participants?: { employee: { full_name: string } }[];
}

export function useTodayMeetings() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('meetings-today-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => {
        queryClient.invalidateQueries({ queryKey: ["today-meetings"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ["today-meetings"],
    queryFn: async () => {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const { data, error } = await supabase
        .from("meetings")
        .select(`
          *,
          participants:meeting_participants(
            employee:employees(full_name)
          )
        `)
        .gte("start_time", startOfDay)
        .lte("start_time", endOfDay)
        .order("start_time", { ascending: true });

      if (error) throw error;
      return data as Meeting[];
    }
  });
}
