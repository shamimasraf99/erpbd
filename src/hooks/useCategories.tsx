import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

export const useCategories = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const createCategory = useMutation({
    mutationFn: async (category: CategoryFormData) => {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'ক্যাটাগরি যোগ করা হয়েছে' });
    },
    onError: (error: Error) => {
      toast({ title: 'ত্রুটি', description: error.message, variant: 'destructive' });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({ id, ...category }: CategoryFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('categories')
        .update(category)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'ক্যাটাগরি আপডেট করা হয়েছে' });
    },
    onError: (error: Error) => {
      toast({ title: 'ত্রুটি', description: error.message, variant: 'destructive' });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({ title: 'ক্যাটাগরি মুছে ফেলা হয়েছে' });
    },
    onError: (error: Error) => {
      toast({ title: 'ত্রুটি', description: error.message, variant: 'destructive' });
    },
  });

  return {
    categories,
    isLoading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
