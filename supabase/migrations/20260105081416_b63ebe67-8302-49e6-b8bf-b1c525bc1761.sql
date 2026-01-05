-- Add deny public access policies to remaining tables and strengthen POS sales

-- 1. performance_reviews - deny public access
DROP POLICY IF EXISTS "Deny public access to performance_reviews" ON public.performance_reviews;
CREATE POLICY "Deny public access to performance_reviews"
ON public.performance_reviews
FOR ALL
TO anon
USING (false);

-- 2. goals - deny public access
DROP POLICY IF EXISTS "Deny public access to goals" ON public.goals;
CREATE POLICY "Deny public access to goals"
ON public.goals
FOR ALL
TO anon
USING (false);

-- 3. estimates - deny public access
DROP POLICY IF EXISTS "Deny public access to estimates" ON public.estimates;
CREATE POLICY "Deny public access to estimates"
ON public.estimates
FOR ALL
TO anon
USING (false);

-- 4. timesheets - deny public access
DROP POLICY IF EXISTS "Deny public access to timesheets" ON public.timesheets;
CREATE POLICY "Deny public access to timesheets"
ON public.timesheets
FOR ALL
TO anon
USING (false);

-- 5. project_budgets - deny public access
DROP POLICY IF EXISTS "Deny public access to project_budgets" ON public.project_budgets;
CREATE POLICY "Deny public access to project_budgets"
ON public.project_budgets
FOR ALL
TO anon
USING (false);

-- 6. attendance - deny public access
DROP POLICY IF EXISTS "Deny public access to attendance" ON public.attendance;
CREATE POLICY "Deny public access to attendance"
ON public.attendance
FOR ALL
TO anon
USING (false);

-- 7. leave_requests - deny public access
DROP POLICY IF EXISTS "Deny public access to leave_requests" ON public.leave_requests;
CREATE POLICY "Deny public access to leave_requests"
ON public.leave_requests
FOR ALL
TO anon
USING (false);

-- 8. tasks - deny public access
DROP POLICY IF EXISTS "Deny public access to tasks" ON public.tasks;
CREATE POLICY "Deny public access to tasks"
ON public.tasks
FOR ALL
TO anon
USING (false);

-- 9. payments - deny public access
DROP POLICY IF EXISTS "Deny public access to payments" ON public.payments;
CREATE POLICY "Deny public access to payments"
ON public.payments
FOR ALL
TO anon
USING (false);

-- 10. projects - deny public access
DROP POLICY IF EXISTS "Deny public access to projects" ON public.projects;
CREATE POLICY "Deny public access to projects"
ON public.projects
FOR ALL
TO anon
USING (false);

-- 11. pos_sales - strengthen INSERT policy to require employee/manager/admin role
DROP POLICY IF EXISTS "Users can create sales" ON public.pos_sales;
CREATE POLICY "Employees can create sales"
ON public.pos_sales
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR 
  has_role(auth.uid(), 'employee'::app_role)
);

-- 12. departments - deny public access
DROP POLICY IF EXISTS "Deny public access to departments" ON public.departments;
CREATE POLICY "Deny public access to departments"
ON public.departments
FOR ALL
TO anon
USING (false);

-- 13. company_settings - deny public access
DROP POLICY IF EXISTS "Deny public access to company_settings" ON public.company_settings;
CREATE POLICY "Deny public access to company_settings"
ON public.company_settings
FOR ALL
TO anon
USING (false);