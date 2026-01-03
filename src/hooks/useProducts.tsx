import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  sku: string | null;
  barcode: string | null;
  category_id: string | null;
  purchase_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_level: number;
  unit: string | null;
  status: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  categories?: {
    id: string;
    name: string;
  } | null;
}

export interface ProductFormData {
  name: string;
  description?: string;
  sku?: string;
  barcode?: string;
  category_id?: string;
  purchase_price: number;
  selling_price: number;
  stock_quantity: number;
  min_stock_level: number;
  unit?: string;
  status?: string;
  image_url?: string;
}

export const useProducts = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(id, name)')
        .order('name');
      
      if (error) throw error;
      return data as Product[];
    },
  });

  const createProduct = useMutation({
    mutationFn: async (product: ProductFormData) => {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'প্রোডাক্ট যোগ করা হয়েছে' });
    },
    onError: (error: Error) => {
      toast({ title: 'ত্রুটি', description: error.message, variant: 'destructive' });
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...product }: ProductFormData & { id: string }) => {
      const { data, error } = await supabase
        .from('products')
        .update(product)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'প্রোডাক্ট আপডেট করা হয়েছে' });
    },
    onError: (error: Error) => {
      toast({ title: 'ত্রুটি', description: error.message, variant: 'destructive' });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'প্রোডাক্ট মুছে ফেলা হয়েছে' });
    },
    onError: (error: Error) => {
      toast({ title: 'ত্রুটি', description: error.message, variant: 'destructive' });
    },
  });

  const updateStock = useMutation({
    mutationFn: async ({ productId, quantity, type, notes }: { 
      productId: string; 
      quantity: number; 
      type: 'in' | 'out' | 'adjustment';
      notes?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      
      // Create stock movement
      const { error: movementError } = await supabase
        .from('stock_movements')
        .insert([{
          product_id: productId,
          movement_type: type,
          quantity,
          notes,
          created_by: user.user?.id,
        }]);
      
      if (movementError) throw movementError;

      // Update product stock
      const { data: product } = await supabase
        .from('products')
        .select('stock_quantity')
        .eq('id', productId)
        .single();
      
      let newQuantity = product?.stock_quantity || 0;
      if (type === 'in') {
        newQuantity += quantity;
      } else if (type === 'out') {
        newQuantity -= quantity;
      } else {
        newQuantity = quantity;
      }

      const { error: updateError } = await supabase
        .from('products')
        .update({ stock_quantity: newQuantity })
        .eq('id', productId);
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'স্টক আপডেট করা হয়েছে' });
    },
    onError: (error: Error) => {
      toast({ title: 'ত্রুটি', description: error.message, variant: 'destructive' });
    },
  });

  const lowStockProducts = products.filter(
    p => p.stock_quantity <= p.min_stock_level && p.status === 'active'
  );

  return {
    products,
    isLoading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    lowStockProducts,
  };
};
