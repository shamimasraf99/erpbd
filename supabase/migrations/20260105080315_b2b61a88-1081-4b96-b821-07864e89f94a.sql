-- Fix ALL security issues: block public access and strengthen RLS policies

-- 1. meeting_participants - block public access & restrict to managers/participants
DROP POLICY IF EXISTS "Deny public access to meeting_participants" ON public.meeting_participants;
CREATE POLICY "Deny public access to meeting_participants"
ON public.meeting_participants
FOR ALL
TO anon
USING (false);

DROP POLICY IF EXISTS "Authenticated users can manage meeting participants" ON public.meeting_participants;
DROP POLICY IF EXISTS "Authenticated users can view meeting participants" ON public.meeting_participants;

CREATE POLICY "Users can view meeting participants"
ON public.meeting_participants
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR
  employee_id IN (SELECT id FROM employees WHERE user_id = auth.uid()) OR
  meeting_id IN (SELECT meeting_id FROM meeting_participants mp JOIN employees e ON mp.employee_id = e.id WHERE e.user_id = auth.uid())
);

CREATE POLICY "Managers can manage meeting participants"
ON public.meeting_participants
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- 2. products - block public access & restrict write to managers
DROP POLICY IF EXISTS "Deny public access to products" ON public.products;
CREATE POLICY "Deny public access to products"
ON public.products
FOR ALL
TO anon
USING (false);

DROP POLICY IF EXISTS "Authenticated users can manage products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can view products" ON public.products;

CREATE POLICY "Authenticated users can view products"
ON public.products
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Managers can manage products"
ON public.products
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'employee'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'employee'::app_role));

-- 3. categories - block public access & restrict write to managers
DROP POLICY IF EXISTS "Deny public access to categories" ON public.categories;
CREATE POLICY "Deny public access to categories"
ON public.categories
FOR ALL
TO anon
USING (false);

DROP POLICY IF EXISTS "Authenticated users can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Authenticated users can view categories" ON public.categories;

CREATE POLICY "Authenticated users can view categories"
ON public.categories
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Managers can manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- 4. meetings - block public access & restrict write to managers/organizers
DROP POLICY IF EXISTS "Deny public access to meetings" ON public.meetings;
CREATE POLICY "Deny public access to meetings"
ON public.meetings
FOR ALL
TO anon
USING (false);

DROP POLICY IF EXISTS "Authenticated users can manage meetings" ON public.meetings;
DROP POLICY IF EXISTS "Authenticated users can view meetings" ON public.meetings;

CREATE POLICY "Users can view meetings"
ON public.meetings
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR
  organizer_id IN (SELECT id FROM employees WHERE user_id = auth.uid()) OR
  id IN (SELECT meeting_id FROM meeting_participants mp JOIN employees e ON mp.employee_id = e.id WHERE e.user_id = auth.uid())
);

CREATE POLICY "Managers can manage meetings"
ON public.meetings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- 5. stock_movements - block public access & restrict write to managers/employees
DROP POLICY IF EXISTS "Deny public access to stock_movements" ON public.stock_movements;
CREATE POLICY "Deny public access to stock_movements"
ON public.stock_movements
FOR ALL
TO anon
USING (false);

DROP POLICY IF EXISTS "Authenticated users can manage stock movements" ON public.stock_movements;
DROP POLICY IF EXISTS "Authenticated users can view stock movements" ON public.stock_movements;

CREATE POLICY "Authenticated users can view stock movements"
ON public.stock_movements
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Managers and employees can manage stock movements"
ON public.stock_movements
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'employee'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role) OR has_role(auth.uid(), 'employee'::app_role));

-- 6. suppliers - block public access & restrict write to managers
DROP POLICY IF EXISTS "Deny public access to suppliers" ON public.suppliers;
CREATE POLICY "Deny public access to suppliers"
ON public.suppliers
FOR ALL
TO anon
USING (false);

DROP POLICY IF EXISTS "Authenticated users can manage suppliers" ON public.suppliers;
DROP POLICY IF EXISTS "Authenticated users can view suppliers" ON public.suppliers;

CREATE POLICY "Authenticated users can view suppliers"
ON public.suppliers
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Managers can manage suppliers"
ON public.suppliers
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- 7. pos_sale_items - block public access & restrict to sale creator/managers
DROP POLICY IF EXISTS "Deny public access to pos_sale_items" ON public.pos_sale_items;
CREATE POLICY "Deny public access to pos_sale_items"
ON public.pos_sale_items
FOR ALL
TO anon
USING (false);

DROP POLICY IF EXISTS "Authenticated users can manage sale items" ON public.pos_sale_items;
DROP POLICY IF EXISTS "Authenticated users can view sale items" ON public.pos_sale_items;

CREATE POLICY "Users can view sale items"
ON public.pos_sale_items
FOR SELECT
TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR
  sale_id IN (SELECT id FROM pos_sales WHERE created_by = auth.uid())
);

CREATE POLICY "Users can create sale items"
ON public.pos_sale_items
FOR INSERT
TO authenticated
WITH CHECK (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'manager'::app_role) OR
  has_role(auth.uid(), 'employee'::app_role)
);

CREATE POLICY "Managers can manage sale items"
ON public.pos_sale_items
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));

-- 8. project_members - block public access & restrict to managers
DROP POLICY IF EXISTS "Deny public access to project_members" ON public.project_members;
CREATE POLICY "Deny public access to project_members"
ON public.project_members
FOR ALL
TO anon
USING (false);

DROP POLICY IF EXISTS "Authenticated users can manage project members" ON public.project_members;
DROP POLICY IF EXISTS "Authenticated users can view project members" ON public.project_members;

CREATE POLICY "Authenticated users can view project members"
ON public.project_members
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Managers can manage project members"
ON public.project_members
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'manager'::app_role));