import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, Receipt, TrendingDown, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { expenseSchema, getFirstErrorMessage } from '@/lib/validations';
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

const statusConfig = {
  pending: { label: 'অপেক্ষমাণ', color: 'bg-warning/10 text-warning' },
  approved: { label: 'অনুমোদিত', color: 'bg-success/10 text-success' },
  rejected: { label: 'প্রত্যাখ্যাত', color: 'bg-destructive/10 text-destructive' },
};

const categories = [
  'অফিস সাপ্লাই',
  'যাতায়াত',
  'খাবার ও আপ্যায়ন',
  'ইউটিলিটি',
  'মার্কেটিং',
  'সফটওয়্যার',
  'হার্ডওয়্যার',
  'অন্যান্য',
];

export default function FinanceExpenses() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    expense_date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
    status: 'pending',
  });
  const queryClient = useQueryClient();

  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        amount: parseFloat(data.amount) || 0,
      };
      if (selectedExpense) {
        const { error } = await supabase.from('expenses').update(payload).eq('id', selectedExpense.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('expenses').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success(selectedExpense ? 'খরচ আপডেট হয়েছে' : 'খরচ যোগ করা হয়েছে');
      setDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error('সেভ করতে সমস্যা হয়েছে'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('খরচ মুছে ফেলা হয়েছে');
      setDeleteDialogOpen(false);
      setSelectedExpense(null);
    },
    onError: () => toast.error('মুছতে সমস্যা হয়েছে'),
  });

  const resetForm = () => {
    setFormData({
      title: '',
      amount: '',
      category: '',
      expense_date: format(new Date(), 'yyyy-MM-dd'),
      notes: '',
      status: 'pending',
    });
    setSelectedExpense(null);
  };

  const handleEdit = (expense: any) => {
    setSelectedExpense(expense);
    setFormData({
      title: expense.title,
      amount: expense.amount?.toString() || '',
      category: expense.category || '',
      expense_date: expense.expense_date || format(new Date(), 'yyyy-MM-dd'),
      notes: expense.notes || '',
      status: expense.status || 'pending',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data with Zod schema
    const result = expenseSchema.safeParse(formData);
    if (!result.success) {
      toast.error(getFirstErrorMessage(result.error));
      return;
    }
    
    saveMutation.mutate(formData);
  };

  const filteredExpenses = expenses?.filter(e =>
    e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalExpense = expenses?.reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
  const pendingExpense = expenses?.filter(e => e.status === 'pending').reduce((sum, e) => sum + (e.amount || 0), 0) || 0;
  const approvedExpense = expenses?.filter(e => e.status === 'approved').reduce((sum, e) => sum + (e.amount || 0), 0) || 0;

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString('bn-BD')}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">খরচ ব্যবস্থাপনা</h1>
          <p className="text-muted-foreground">সকল খরচ পরিচালনা করুন</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> নতুন খরচ
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalExpense)}</p>
                <p className="text-sm text-muted-foreground">মোট খরচ</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Receipt className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(pendingExpense)}</p>
                <p className="text-sm text-muted-foreground">অপেক্ষমাণ</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Receipt className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(approvedExpense)}</p>
                <p className="text-sm text-muted-foreground">অনুমোদিত</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="খরচ খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle>খরচ তালিকা</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">লোড হচ্ছে...</div>
          ) : filteredExpenses?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">কোনো খরচ নেই</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">বিবরণ</th>
                    <th className="text-left py-3 px-4">ক্যাটাগরি</th>
                    <th className="text-left py-3 px-4">তারিখ</th>
                    <th className="text-right py-3 px-4">পরিমাণ</th>
                    <th className="text-left py-3 px-4">স্ট্যাটাস</th>
                    <th className="text-left py-3 px-4">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses?.map((expense) => {
                    const status = statusConfig[expense.status as keyof typeof statusConfig] || statusConfig.pending;
                    return (
                      <tr key={expense.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{expense.title}</td>
                        <td className="py-3 px-4 text-muted-foreground">{expense.category || '-'}</td>
                        <td className="py-3 px-4">
                          {format(new Date(expense.expense_date), 'dd MMM yyyy', { locale: bn })}
                        </td>
                        <td className="py-3 px-4 text-right font-medium">{formatCurrency(expense.amount)}</td>
                        <td className="py-3 px-4">
                          <Badge className={status.color}>{status.label}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(expense)}>
                                <Edit className="mr-2 h-4 w-4" /> এডিট
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => { setSelectedExpense(expense); setDeleteDialogOpen(true); }}
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
            <DialogTitle>{selectedExpense ? 'খরচ এডিট' : 'নতুন খরচ'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>খরচের বিবরণ *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
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
                <Label>ক্যাটাগরি</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
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
                  value={formData.expense_date}
                  onChange={(e) => setFormData({ ...formData, expense_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>স্ট্যাটাস</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        onConfirm={() => selectedExpense && deleteMutation.mutate(selectedExpense.id)}
        title="খরচ ডিলিট করুন"
        description="আপনি কি নিশ্চিত এই খরচটি ডিলিট করতে চান?"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
