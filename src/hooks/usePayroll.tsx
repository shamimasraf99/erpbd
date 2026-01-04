import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export interface Payroll {
  id: string;
  employee_id: string;
  month: string;
  basic_salary: number;
  allowances: number;
  deductions: number;
  bonus: number;
  net_salary: number;
  status: string;
  payment_date: string | null;
  notes: string | null;
  created_at: string;
  employee?: { full_name: string; designation: string };
}

export const usePayroll = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('payroll-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'payroll' }, () => {
        queryClient.invalidateQueries({ queryKey: ['payroll'] });
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  return useQuery({
    queryKey: ['payroll'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll')
        .select(`*, employee:employees(full_name, designation)`)
        .order('month', { ascending: false });
      if (error) throw error;
      return data as Payroll[];
    },
  });
};
