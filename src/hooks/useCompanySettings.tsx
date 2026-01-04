import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CompanySettings {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  website: string | null;
  tax_number: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanySettingsFormData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  website?: string;
  tax_number?: string;
}

export const useCompanySettings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['company-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('company_settings')
        .select('*')
        .limit(1)
        .single();
      
      if (error) throw error;
      return data as CompanySettings;
    },
  });

  const updateSettings = useMutation({
    mutationFn: async (formData: CompanySettingsFormData) => {
      if (!settings?.id) throw new Error('Settings not found');
      
      const { data, error } = await supabase
        .from('company_settings')
        .update(formData)
        .eq('id', settings.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-settings'] });
      toast({ title: 'সেটিংস সংরক্ষিত হয়েছে' });
    },
    onError: (error: Error) => {
      toast({ title: 'ত্রুটি', description: error.message, variant: 'destructive' });
    },
  });

  const uploadLogo = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `company-logo-${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Logo upload error:', error);
      toast({ title: 'লোগো আপলোড ব্যর্থ', variant: 'destructive' });
      return null;
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    uploadLogo,
  };
};
