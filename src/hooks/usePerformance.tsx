import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface PerformanceReview {
  id: string;
  employee_id: string;
  reviewer_id: string | null;
  review_period: string;
  rating: number;
  strengths: string | null;
  improvements: string | null;
  goals_achieved: string | null;
  comments: string | null;
  status: string;
  review_date: string;
  created_at: string;
  employee?: { full_name: string; designation: string };
  reviewer?: { full_name: string };
}

export const usePerformance = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('performance-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'performance_reviews' }, () => {
        queryClient.invalidateQueries({ queryKey: ['performance'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_reviews')
        .select(`*, employee:employees!performance_reviews_employee_id_fkey(full_name, designation), reviewer:employees!performance_reviews_reviewer_id_fkey(full_name)`)
        .order('review_date', { ascending: false });
      if (error) throw error;
      return data as PerformanceReview[];
    },
  });
};
