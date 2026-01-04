import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, CreditCard, Banknote, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { bn } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';

const paymentMethods = [
  { value: 'cash', label: 'নগদ', icon: Banknote },
  { value: 'bank', label: 'ব্যাংক ট্রান্সফার', icon: CreditCard },
  { value: 'bkash', label: 'বিকাশ', icon: CreditCard },
  { value: 'nagad', label: 'নগদ (মোবাইল)', icon: CreditCard },
  { value: 'card', label: 'কার্ড', icon: CreditCard },
];

export default function FinancePayments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [formData, setFormData] = useState({
    invoice_id: '',
    amount: '',
    payment_method: 'cash',
    payment_date: format(new Date(), 'yyyy-MM-dd'),
    reference_number: '',
    notes: '',
  });
  const queryClient = useQueryClient();

  const { data: invoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase.from('invoices').select('*, clients(name)');
      if (error) throw error;
      return data;
    },
  });

  const { data: payments, isLoading } = useQuery({
    queryKey: ['payments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('*, invoices(invoice_number, clients(name))')
        .order('payment_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        amount: parseFloat(data.amount) || 0,
        invoice_id: data.invoice_id || null,
      };
      if (selectedPayment) {
        const { error } = await supabase.from('payments').update(payload).eq('id', selectedPayment.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('payments').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success(selectedPayment ? 'পেমেন্ট আপডেট হয়েছে' : 'পেমেন্ট যোগ করা হয়েছে');
      setDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error('সেভ করতে সমস্যা হয়েছে'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('payments').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      toast.success('পেমেন্ট মুছে ফেলা হয়েছে');
      setDeleteDialogOpen(false);
      setSelectedPayment(null);
    },
    onError: () => toast.error('মুছতে সমস্যা হয়েছে'),
  });

  const resetForm = () => {
    setFormData({
      invoice_id: '',
      amount: '',
      payment_method: 'cash',
      payment_date: format(new Date(), 'yyyy-MM-dd'),
      reference_number: '',
      notes: '',
    });
    setSelectedPayment(null);
  };

  const handleEdit = (payment: any) => {
    setSelectedPayment(payment);
    setFormData({
      invoice_id: payment.invoice_id || '',
      amount: payment.amount?.toString() || '',
      payment_method: payment.payment_method || 'cash',
      payment_date: payment.payment_date || format(new Date(), 'yyyy-MM-dd'),
      reference_number: payment.reference_number || '',
      notes: payment.notes || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount) {
      toast.error('পরিমাণ দিন');
      return;
    }
    saveMutation.mutate(formData);
  };

  const filteredPayments = payments?.filter(p =>
    p.invoices?.invoice_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.invoices?.clients?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPayments = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0;

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString('bn-BD')}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">পেমেন্ট ট্র্যাকিং</h1>
          <p className="text-muted-foreground">সকল পেমেন্ট পরিচালনা করুন</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> নতুন পেমেন্ট
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Banknote className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalPayments)}</p>
                <p className="text-sm text-muted-foreground">মোট পেমেন্ট</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CreditCard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{payments?.length || 0}</p>
                <p className="text-sm text-muted-foreground">মোট ট্রান্সাকশন</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Banknote className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(payments?.length ? totalPayments / payments.length : 0)}
                </p>
                <p className="text-sm text-muted-foreground">গড় পেমেন্ট</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="পেমেন্ট খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>পেমেন্ট তালিকা</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">লোড হচ্ছে...</div>
          ) : filteredPayments?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">কোনো পেমেন্ট নেই</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">ইনভয়েস</th>
                    <th className="text-left py-3 px-4">ক্লায়েন্ট</th>
                    <th className="text-left py-3 px-4">তারিখ</th>
                    <th className="text-left py-3 px-4">মাধ্যম</th>
                    <th className="text-right py-3 px-4">পরিমাণ</th>
                    <th className="text-left py-3 px-4">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments?.map((payment) => {
                    const method = paymentMethods.find(m => m.value === payment.payment_method);
                    return (
                      <tr key={payment.id} className="border-b">
                        <td className="py-3 px-4 font-medium">
                          {payment.invoices?.invoice_number || '-'}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {payment.invoices?.clients?.name || '-'}
                        </td>
                        <td className="py-3 px-4">
                          {format(new Date(payment.payment_date), 'dd MMM yyyy', { locale: bn })}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{method?.label || payment.payment_method}</Badge>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-success">
                          {formatCurrency(payment.amount)}
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(payment)}>
                                <Edit className="mr-2 h-4 w-4" /> এডিট
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => { setSelectedPayment(payment); setDeleteDialogOpen(true); }}
                                className="text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> ডিলিট
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPayment ? 'পেমেন্ট এডিট' : 'নতুন পেমেন্ট'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>ইনভয়েস</Label>
              <Select
                value={formData.invoice_id}
                onValueChange={(value) => setFormData({ ...formData, invoice_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ইনভয়েস নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {invoices?.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.invoice_number} - {inv.clients?.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>পরিমাণ (৳) *</Label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>পেমেন্ট মাধ্যম</Label>
                <Select
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>{method.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>তারিখ</Label>
                <Input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>রেফারেন্স নম্বর</Label>
                <Input
                  value={formData.reference_number}
                  onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>নোট</Label>
              <Textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => selectedPayment && deleteMutation.mutate(selectedPayment.id)}
        title="পেমেন্ট ডিলিট করুন"
        description="আপনি কি নিশ্চিত এই পেমেন্টটি ডিলিট করতে চান?"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
