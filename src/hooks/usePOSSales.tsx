import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface POSSaleItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  discount: number;
  total_price: number;
}

export interface POSSale {
  id: string;
  invoice_number: string;
  customer_name: string | null;
  customer_phone: string | null;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  payment_method: string | null;
  payment_status: string | null;
  created_by: string | null;
  created_at: string;
}

export interface CreateSaleData {
  customer_name?: string;
  customer_phone?: string;
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  payment_method: string;
  items: POSSaleItem[];
}

export const usePOSSales = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: sales = [], isLoading, error } = useQuery({
    queryKey: ['pos_sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pos_sales')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as POSSale[];
    },
  });

  const createSale = useMutation({
    mutationFn: async ({ items, ...saleData }: CreateSaleData) => {
      const { data: user } = await supabase.auth.getUser();
      
      // Generate invoice number
      const { data: invoiceData } = await supabase.rpc('generate_pos_invoice_number');
      
      // Create sale
      const { data: sale, error: saleError } = await supabase
        .from('pos_sales')
        .insert([{
          ...saleData,
          invoice_number: invoiceData,
          created_by: user.user?.id,
        }])
        .select()
        .single();
      
      if (saleError) throw saleError;

      // Create sale items
      const saleItems = items.map(item => ({
        ...item,
        sale_id: sale.id,
      }));

      const { error: itemsError } = await supabase
        .from('pos_sale_items')
        .insert(saleItems);
      
      if (itemsError) throw itemsError;

      return sale;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pos_sales'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({ title: 'বিক্রয় সম্পন্ন হয়েছে' });
    },
    onError: (error: Error) => {
      toast({ title: 'ত্রুটি', description: error.message, variant: 'destructive' });
    },
  });

  const getTodaysSales = () => {
    const today = new Date().toISOString().split('T')[0];
    return sales.filter(sale => sale.created_at.startsWith(today));
  };

  const getTodaysTotal = () => {
    return getTodaysSales().reduce((sum, sale) => sum + Number(sale.total_amount), 0);
  };

  return {
    sales,
    isLoading,
    error,
    createSale,
    getTodaysSales,
    getTodaysTotal,
  };
};
