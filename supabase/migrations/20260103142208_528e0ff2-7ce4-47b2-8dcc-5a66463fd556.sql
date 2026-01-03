-- Create meetings table
CREATE TABLE public.meetings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  meeting_type TEXT DEFAULT 'internal',
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  meeting_link TEXT,
  organizer_id UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create meeting participants junction table
CREATE TABLE public.meeting_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  meeting_id UUID NOT NULL REFERENCES public.meetings(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  UNIQUE(meeting_id, employee_id)
);

-- Enable RLS
ALTER TABLE public.meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meeting_participants ENABLE ROW LEVEL SECURITY;

-- Create policies for meetings
CREATE POLICY "Authenticated users can view meetings" 
ON public.meetings FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage meetings" 
ON public.meetings FOR ALL USING (true) WITH CHECK (true);

-- Create policies for meeting participants
CREATE POLICY "Authenticated users can view meeting participants" 
ON public.meeting_participants FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage meeting participants" 
ON public.meeting_participants FOR ALL USING (true) WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_meetings_updated_at
BEFORE UPDATE ON public.meetings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample meetings data
INSERT INTO public.meetings (title, meeting_type, start_time, duration_minutes, location) VALUES
('ক্লায়েন্ট মিটিং - ABC Corp', 'client', NOW() + INTERVAL '2 hours', 60, 'কনফারেন্স রুম ১'),
('টিম স্ট্যান্ডআপ', 'internal', NOW() + INTERVAL '30 minutes', 30, 'অনলাইন'),
('প্রজেক্ট রিভিউ', 'internal', NOW() + INTERVAL '4 hours', 90, 'মিটিং রুম ২'),
('নতুন প্রজেক্ট ব্রিফিং', 'client', NOW() + INTERVAL '1 day', 120, 'ক্লায়েন্ট অফিস');