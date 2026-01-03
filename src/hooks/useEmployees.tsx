import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Employee {
  id: string;
  full_name: string;
  designation: string | null;
  department_id: string | null;
  department_name?: string;
  email: string;
  phone: string | null;
  join_date: string;
  status: string | null;
  salary: number | null;
}

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data: employees, error } = await supabase
        .from("employees")
        .select(`
          id,
          full_name,
          designation,
          department_id,
          email,
          phone,
          join_date,
          status,
          salary
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Fetch departments separately to get names
      const { data: departments } = await supabase
        .from("departments")
        .select("id, name");

      const departmentMap = new Map(departments?.map(d => [d.id, d.name]) || []);

      return (employees || []).map(emp => ({
        ...emp,
        department_name: emp.department_id ? departmentMap.get(emp.department_id) : null
      }));
    }
  });
}

export function useEmployeeCount() {
  return useQuery({
    queryKey: ["employees-count"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("employees")
        .select("*", { count: "exact", head: true });

      if (error) throw error;
      return count || 0;
    }
  });
}
