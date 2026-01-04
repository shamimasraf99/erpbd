import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Plus, Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { format, differenceInDays } from 'date-fns';
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
import { MoreHorizontal } from 'lucide-react';

const statusConfig = {
  pending: { label: 'অপেক্ষমাণ', color: 'bg-warning/10 text-warning' },
  approved: { label: 'অনুমোদিত', color: 'bg-success/10 text-success' },
  rejected: { label: 'প্রত্যাখ্যাত', color: 'bg-destructive/10 text-destructive' },
};

const leaveTypes = [
  { value: 'casual', label: 'ক্যাজুয়াল ছুটি' },
  { value: 'sick', label: 'অসুস্থতাজনিত ছুটি' },
  { value: 'annual', label: 'বার্ষিক ছুটি' },
  { value: 'emergency', label: 'জরুরি ছুটি' },
];

export default function HRMLeave() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    leave_type: 'casual',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
    reason: '',
  });
  const queryClient = useQueryClient();

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase.from('employees').select('*').eq('status', 'active');
      if (error) throw error;
      return data;
    },
  });

  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leave_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('leave_requests').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave_requests'] });
      toast.success('ছুটির আবেদন জমা দেওয়া হয়েছে');
      setDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error('আবেদন জমা দিতে সমস্যা হয়েছে'),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('leave_requests').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave_requests'] });
      toast.success('স্ট্যাটাস আপডেট হয়েছে');
    },
    onError: () => toast.error('স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('leave_requests').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave_requests'] });
      toast.success('আবেদন মুছে ফেলা হয়েছে');
    },
    onError: () => toast.error('মুছতে সমস্যা হয়েছে'),
  });

  const resetForm = () => {
    setFormData({
      employee_id: '',
      leave_type: 'casual',
      start_date: format(new Date(), 'yyyy-MM-dd'),
      end_date: format(new Date(), 'yyyy-MM-dd'),
      reason: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employee_id) {
      toast.error('কর্মচারী নির্বাচন করুন');
      return;
    }
    addMutation.mutate(formData);
  };

  const filteredRequests = leaveRequests;

  const employeeMap = new Map(employees?.map(e => [e.id, e]) || []);

  const stats = {
    pending: leaveRequests?.filter(r => r.status === 'pending').length || 0,
    approved: leaveRequests?.filter(r => r.status === 'approved').length || 0,
    rejected: leaveRequests?.filter(r => r.status === 'rejected').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">ছুটি ব্যবস্থাপনা</h1>
          <p className="text-muted-foreground">কর্মচারীদের ছুটির আবেদন পরিচালনা করুন</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> নতুন আবেদন
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">অপেক্ষমাণ</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Check className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.approved}</p>
                <p className="text-sm text-muted-foreground">অনুমোদিত</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <X className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rejected}</p>
                <p className="text-sm text-muted-foreground">প্রত্যাখ্যাত</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="কর্মচারী খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            ছুটির আবেদন তালিকা
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">লোড হচ্ছে...</div>
          ) : filteredRequests?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              কোনো ছুটির আবেদন নেই
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">কর্মচারী</th>
                    <th className="text-left py-3 px-4">ছুটির ধরন</th>
                    <th className="text-left py-3 px-4">তারিখ</th>
                    <th className="text-left py-3 px-4">দিন</th>
                    <th className="text-left py-3 px-4">স্ট্যাটাস</th>
                    <th className="text-left py-3 px-4">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests?.map((request) => {
                    const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending;
                    const days = differenceInDays(new Date(request.end_date), new Date(request.start_date)) + 1;
                    const leaveType = leaveTypes.find(t => t.value === request.leave_type);
                    return (
                      <tr key={request.id} className="border-b">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{employeeMap.get(request.employee_id)?.full_name || '-'}</p>
                            <p className="text-sm text-muted-foreground">{employeeMap.get(request.employee_id)?.designation || '-'}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{leaveType?.label || request.leave_type}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <p>{format(new Date(request.start_date), 'dd MMM', { locale: bn })}</p>
                            <p className="text-muted-foreground">- {format(new Date(request.end_date), 'dd MMM yyyy', { locale: bn })}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{days} দিন</td>
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
                              {request.status === 'pending' && (
                                <>
                                  <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: request.id, status: 'approved' })}>
                                    <Check className="mr-2 h-4 w-4" /> অনুমোদন
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateStatusMutation.mutate({ id: request.id, status: 'rejected' })}>
                                    <X className="mr-2 h-4 w-4" /> প্রত্যাখ্যান
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem onClick={() => deleteMutation.mutate(request.id)} className="text-destructive">
                                মুছে ফেলুন
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

      {/* Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ছুটির আবেদন</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>কর্মচারী *</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="কর্মচারী নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ছুটির ধরন</Label>
              <Select
                value={formData.leave_type}
                onValueChange={(value) => setFormData({ ...formData, leave_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>শুরুর তারিখ</Label>
                <Input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>শেষ তারিখ</Label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>কারণ</Label>
              <Textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending ? 'জমা হচ্ছে...' : 'জমা দিন'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
