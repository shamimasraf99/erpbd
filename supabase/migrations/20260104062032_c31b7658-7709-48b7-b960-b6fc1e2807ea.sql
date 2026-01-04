-- Fix systemic over-permissive RLS policies
-- Implementing role-based access control for sensitive tables

-- =====================================================
-- 1. FIX LEADS TABLE (Sales Data Protection)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can manage leads" ON public.leads;

-- Sales team, managers, admins, and assigned employees can view leads
CREATE POLICY "Authorized users can view leads"
ON public.leads FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager') OR
  EXISTS (
    SELECT 1 FROM public.employees e
    WHERE e.user_id = auth.uid()
    AND (e.id = leads.assigned_to OR e.designation ILIKE '%sales%' OR e.designation ILIKE '%বিক্রয়%')
  )
);

-- Managers and admins can manage leads
CREATE POLICY "Managers can manage leads"
ON public.leads FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- =====================================================
-- 2. FIX EMPLOYEES TABLE (HR Data Protection)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view employees" ON public.employees;
DROP POLICY IF EXISTS "Admins can manage employees" ON public.employees;

-- Users can view own record, managers/admins can view all (but non-sensitive data only via app logic)
CREATE POLICY "Users can view employees"
ON public.employees FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() OR
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- Only admins and managers can manage employees
CREATE POLICY "Admins and managers can manage employees"
ON public.employees FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- =====================================================
-- 3. FIX INVOICES TABLE (Financial Data Protection)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view invoices" ON public.invoices;
DROP POLICY IF EXISTS "Authenticated users can manage invoices" ON public.invoices;

-- Managers and admins can view invoices
CREATE POLICY "Authorized users can view invoices"
ON public.invoices FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- Only managers and admins can manage invoices
CREATE POLICY "Managers can manage invoices"
ON public.invoices FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- =====================================================
-- 4. FIX PAYMENTS TABLE (Financial Data Protection)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view payments" ON public.payments;
DROP POLICY IF EXISTS "Authenticated users can manage payments" ON public.payments;

-- Managers and admins can view payments
CREATE POLICY "Authorized users can view payments"
ON public.payments FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- Only managers and admins can manage payments
CREATE POLICY "Managers can manage payments"
ON public.payments FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- =====================================================
-- 5. FIX EXPENSES TABLE (Financial Data Protection)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can manage expenses" ON public.expenses;

-- Users can view own expenses, managers/admins can view all
CREATE POLICY "Users can view expenses"
ON public.expenses FOR SELECT
TO authenticated
USING (
  employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- Users can create own expenses, managers/admins can manage all
CREATE POLICY "Users can manage own expenses"
ON public.expenses FOR INSERT
TO authenticated
WITH CHECK (
  employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

CREATE POLICY "Managers can manage all expenses"
ON public.expenses FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- =====================================================
-- 6. FIX ATTENDANCE TABLE (HR Data Protection)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view attendance" ON public.attendance;
DROP POLICY IF EXISTS "Employees can manage own attendance" ON public.attendance;

-- Users can view own attendance, managers/admins can view all
CREATE POLICY "Users can view attendance"
ON public.attendance FOR SELECT
TO authenticated
USING (
  employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- Users can manage own attendance, managers/admins can manage all
CREATE POLICY "Users can manage own attendance"
ON public.attendance FOR INSERT
TO authenticated
WITH CHECK (
  employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

CREATE POLICY "Managers can manage all attendance"
ON public.attendance FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- =====================================================
-- 7. FIX LEAVE_REQUESTS TABLE (HR Data Protection)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view leave requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Authenticated users can manage leave requests" ON public.leave_requests;

-- Users can view own leave requests, managers/admins can view all
CREATE POLICY "Users can view leave requests"
ON public.leave_requests FOR SELECT
TO authenticated
USING (
  employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- Users can create own leave requests
CREATE POLICY "Users can create leave requests"
ON public.leave_requests FOR INSERT
TO authenticated
WITH CHECK (
  employee_id IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- Managers can manage all leave requests
CREATE POLICY "Managers can manage leave requests"
ON public.leave_requests FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- =====================================================
-- 8. FIX PROJECTS TABLE (Business Data Protection)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;

-- All authenticated users can view projects (needed for task assignment)
CREATE POLICY "Authenticated users can view projects"
ON public.projects FOR SELECT
TO authenticated
USING (true);

-- Only managers and admins can manage projects
CREATE POLICY "Managers can manage projects"
ON public.projects FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- =====================================================
-- 9. FIX TASKS TABLE (Project Data Protection)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Authenticated users can manage tasks" ON public.tasks;

-- Users can view tasks assigned to them or if manager/admin
CREATE POLICY "Users can view tasks"
ON public.tasks FOR SELECT
TO authenticated
USING (
  assigned_to IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- Users can update tasks assigned to them
CREATE POLICY "Users can update assigned tasks"
ON public.tasks FOR UPDATE
TO authenticated
USING (
  assigned_to IN (SELECT id FROM public.employees WHERE user_id = auth.uid()) OR
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- Only managers and admins can create/delete tasks
CREATE POLICY "Managers can manage tasks"
ON public.tasks FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- =====================================================
-- 10. FIX CLIENTS TABLE (CRM Data Protection)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view clients" ON public.clients;
DROP POLICY IF EXISTS "Authenticated users can manage clients" ON public.clients;

-- All authenticated users can view clients
CREATE POLICY "Authenticated users can view clients"
ON public.clients FOR SELECT
TO authenticated
USING (true);

-- Only managers and admins can manage clients
CREATE POLICY "Managers can manage clients"
ON public.clients FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- =====================================================
-- 11. FIX COMPANY_SETTINGS TABLE (Admin Only)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view company settings" ON public.company_settings;
DROP POLICY IF EXISTS "Admins can manage company settings" ON public.company_settings;

-- All authenticated users can view company settings (needed for invoices, etc)
CREATE POLICY "Authenticated users can view company settings"
ON public.company_settings FOR SELECT
TO authenticated
USING (true);

-- Only admins can manage company settings
CREATE POLICY "Admins can manage company settings"
ON public.company_settings FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =====================================================
-- 12. FIX POS_SALES TABLE (Sales Data Protection)
-- =====================================================
DROP POLICY IF EXISTS "Authenticated users can view sales" ON public.pos_sales;
DROP POLICY IF EXISTS "Authenticated users can manage sales" ON public.pos_sales;

-- Users can view own sales, managers/admins can view all
CREATE POLICY "Users can view sales"
ON public.pos_sales FOR SELECT
TO authenticated
USING (
  created_by = auth.uid() OR
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);

-- Users can create sales
CREATE POLICY "Users can create sales"
ON public.pos_sales FOR INSERT
TO authenticated
WITH CHECK (true);

-- Managers can manage all sales
CREATE POLICY "Managers can manage sales"
ON public.pos_sales FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR
  public.has_role(auth.uid(), 'manager')
);