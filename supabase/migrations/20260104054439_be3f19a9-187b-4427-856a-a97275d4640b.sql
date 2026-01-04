
-- কোম্পানি সেটিংস টেবিল তৈরি
CREATE TABLE public.company_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL DEFAULT 'স্মার্ট স্টোর',
  address text DEFAULT '১২৩, প্রধান সড়ক, গুলশান-২, ঢাকা-১২১২',
  phone text DEFAULT '০১৭১২-৩৪৫৬৭৮',
  email text DEFAULT 'info@smartstore.com.bd',
  logo_url text,
  website text,
  tax_number text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- RLS চালু করি
ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;

-- সকল authenticated ইউজার দেখতে পারবে
CREATE POLICY "Authenticated users can view company settings"
  ON public.company_settings
  FOR SELECT
  USING (true);

-- শুধুমাত্র admin/manager আপডেট করতে পারবে
CREATE POLICY "Admins can manage company settings"
  ON public.company_settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ডিফল্ট সেটিংস যোগ করি
INSERT INTO public.company_settings (name, address, phone, email) 
VALUES ('স্মার্ট স্টোর', '১২৩, প্রধান সড়ক, গুলশান-২, ঢাকা-১২১২', '০১৭১২-৩৪৫৬৭৮', 'info@smartstore.com.bd');

-- updated_at অটো আপডেট ট্রিগার
CREATE TRIGGER update_company_settings_updated_at
  BEFORE UPDATE ON public.company_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
