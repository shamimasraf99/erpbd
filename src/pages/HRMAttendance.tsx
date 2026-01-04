import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, Search, Plus, UserCheck, UserX, Coffee } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { attendanceSchema, getFirstErrorMessage } from '@/lib/validations';
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

const statusConfig = {
  present: { label: 'উপস্থিত', color: 'bg-success/10 text-success', icon: UserCheck },
  absent: { label: 'অনুপস্থিত', color: 'bg-destructive/10 text-destructive', icon: UserX },
  late: { label: 'দেরি', color: 'bg-warning/10 text-warning', icon: Clock },
  leave: { label: 'ছুটি', color: 'bg-muted text-muted-foreground', icon: Coffee },
};

export default function HRMAttendance() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    check_in: '',
    check_out: '',
    status: 'present',
    notes: '',
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

  const { data: attendance, isLoading } = useQuery({
    queryKey: ['attendance', selectedDate],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*, employees(full_name, designation)')
        .eq('date', selectedDate);
      if (error) throw error;
      return data;
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase.from('attendance').insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
      toast.success('উপস্থিতি রেকর্ড যোগ করা হয়েছে');
      setDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error('উপস্থিতি যোগ করতে সমস্যা হয়েছে'),
  });

  const resetForm = () => {
    setFormData({
      employee_id: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      check_in: '',
      check_out: '',
      status: 'present',
      notes: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data with Zod schema
    const result = attendanceSchema.safeParse(formData);
    if (!result.success) {
      toast.error(getFirstErrorMessage(result.error));
      return;
    }
    
    addMutation.mutate(formData);
  };

  const filteredAttendance = attendance?.filter(a =>
    a.employees?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    present: attendance?.filter(a => a.status === 'present').length || 0,
    absent: attendance?.filter(a => a.status === 'absent').length || 0,
    late: attendance?.filter(a => a.status === 'late').length || 0,
    leave: attendance?.filter(a => a.status === 'leave').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">উপস্থিতি ট্র্যাকিং</h1>
          <p className="text-muted-foreground">কর্মচারীদের দৈনিক উপস্থিতি পরিচালনা করুন</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> উপস্থিতি যোগ করুন
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <Card key={key}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${config.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats[key as keyof typeof stats]}</p>
                    <p className="text-sm text-muted-foreground">{config.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="কর্মচারী খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full sm:w-auto"
        />
      </div>

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {format(new Date(selectedDate), 'dd MMMM yyyy', { locale: bn })} এর উপস্থিতি
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">লোড হচ্ছে...</div>
          ) : filteredAttendance?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              এই তারিখে কোনো উপস্থিতি রেকর্ড নেই
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">কর্মচারী</th>
                    <th className="text-left py-3 px-4">পদবী</th>
                    <th className="text-left py-3 px-4">চেক-ইন</th>
                    <th className="text-left py-3 px-4">চেক-আউট</th>
                    <th className="text-left py-3 px-4">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance?.map((record) => {
                    const status = statusConfig[record.status as keyof typeof statusConfig] || statusConfig.present;
                    return (
                      <tr key={record.id} className="border-b">
                        <td className="py-3 px-4 font-medium">{record.employees?.full_name}</td>
                        <td className="py-3 px-4 text-muted-foreground">{record.employees?.designation}</td>
                        <td className="py-3 px-4">{record.check_in || '-'}</td>
                        <td className="py-3 px-4">{record.check_out || '-'}</td>
                        <td className="py-3 px-4">
                          <Badge className={status.color}>{status.label}</Badge>
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
            <DialogTitle>উপস্থিতি যোগ করুন</DialogTitle>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>তারিখ</Label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>চেক-ইন সময়</Label>
                <Input
                  type="time"
                  value={formData.check_in}
                  onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>চেক-আউট সময়</Label>
                <Input
                  type="time"
                  value={formData.check_out}
                  onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
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
              <Button type="submit" disabled={addMutation.isPending}>
                {addMutation.isPending ? 'সেভ হচ্ছে...' : 'সেভ করুন'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
