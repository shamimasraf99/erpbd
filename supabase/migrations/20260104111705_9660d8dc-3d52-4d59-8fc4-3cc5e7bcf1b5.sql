-- Fix clients table: Restrict SELECT to only admin/manager roles (same as management)
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;

CREATE POLICY "Authorized users can view clients" 
ON public.clients 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));