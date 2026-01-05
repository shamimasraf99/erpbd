-- Fix all error-level security findings by adding explicit public access denial policies

-- 1. profiles table - deny public access
DROP POLICY IF EXISTS "Deny public access to profiles" ON public.profiles;
CREATE POLICY "Deny public access to profiles"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- 2. employees table - deny public access
DROP POLICY IF EXISTS "Deny public access to employees" ON public.employees;
CREATE POLICY "Deny public access to employees"
ON public.employees
FOR ALL
TO anon
USING (false);

-- 3. clients table - deny public access
DROP POLICY IF EXISTS "Deny public access to clients" ON public.clients;
CREATE POLICY "Deny public access to clients"
ON public.clients
FOR ALL
TO anon
USING (false);

-- 4. payroll table - deny public access
DROP POLICY IF EXISTS "Deny public access to payroll" ON public.payroll;
CREATE POLICY "Deny public access to payroll"
ON public.payroll
FOR ALL
TO anon
USING (false);

-- 5. invoices table - deny public access
DROP POLICY IF EXISTS "Deny public access to invoices" ON public.invoices;
CREATE POLICY "Deny public access to invoices"
ON public.invoices
FOR ALL
TO anon
USING (false);

-- 6. contracts table - deny public access
DROP POLICY IF EXISTS "Deny public access to contracts" ON public.contracts;
CREATE POLICY "Deny public access to contracts"
ON public.contracts
FOR ALL
TO anon
USING (false);

-- 7. accounting_entries table - deny public access
DROP POLICY IF EXISTS "Deny public access to accounting_entries" ON public.accounting_entries;
CREATE POLICY "Deny public access to accounting_entries"
ON public.accounting_entries
FOR ALL
TO anon
USING (false);

-- 8. leads table - deny public access
DROP POLICY IF EXISTS "Deny public access to leads" ON public.leads;
CREATE POLICY "Deny public access to leads"
ON public.leads
FOR ALL
TO anon
USING (false);

-- 9. deals table - deny public access
DROP POLICY IF EXISTS "Deny public access to deals" ON public.deals;
CREATE POLICY "Deny public access to deals"
ON public.deals
FOR ALL
TO anon
USING (false);

-- 10. expenses table - deny public access
DROP POLICY IF EXISTS "Deny public access to expenses" ON public.expenses;
CREATE POLICY "Deny public access to expenses"
ON public.expenses
FOR ALL
TO anon
USING (false);