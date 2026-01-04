import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, CheckCircle2, Circle, Clock, AlertCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
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

const statusConfig = {
  pending: { label: 'অপেক্ষমাণ', color: 'bg-muted text-muted-foreground', icon: Circle },
  in_progress: { label: 'চলমান', color: 'bg-primary/10 text-primary', icon: Clock },
  completed: { label: 'সম্পন্ন', color: 'bg-success/10 text-success', icon: CheckCircle2 },
  cancelled: { label: 'বাতিল', color: 'bg-destructive/10 text-destructive', icon: AlertCircle },
};

const priorityConfig = {
  low: { label: 'নিম্ন', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'মাঝারি', color: 'bg-warning/10 text-warning' },
  high: { label: 'উচ্চ', color: 'bg-destructive/10 text-destructive' },
};

export default function ProjectTasks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_id: '',
    assigned_to: '',
    due_date: '',
    priority: 'medium',
    status: 'pending',
  });
  const queryClient = useQueryClient();

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) throw error;
      return data;
    },
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase.from('employees').select('*').eq('status', 'active');
      if (error) throw error;
      return data;
    },
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*, projects(name), employees:assigned_to(full_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        project_id: data.project_id || null,
        assigned_to: data.assigned_to || null,
        due_date: data.due_date || null,
      };
      if (selectedTask) {
        const { error } = await supabase.from('tasks').update(payload).eq('id', selectedTask.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tasks').insert([payload]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(selectedTask ? 'টাস্ক আপডেট হয়েছে' : 'টাস্ক যোগ করা হয়েছে');
      setDialogOpen(false);
      resetForm();
    },
    onError: () => toast.error('সেভ করতে সমস্যা হয়েছে'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('টাস্ক মুছে ফেলা হয়েছে');
      setDeleteDialogOpen(false);
      setSelectedTask(null);
    },
    onError: () => toast.error('মুছতে সমস্যা হয়েছে'),
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      project_id: '',
      assigned_to: '',
      due_date: '',
      priority: 'medium',
      status: 'pending',
    });
    setSelectedTask(null);
  };

  const handleEdit = (task: any) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      project_id: task.project_id || '',
      assigned_to: task.assigned_to || '',
      due_date: task.due_date || '',
      priority: task.priority || 'medium',
      status: task.status || 'pending',
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('টাস্কের নাম দিন');
      return;
    }
    saveMutation.mutate(formData);
  };

  const filteredTasks = tasks?.filter(t =>
    t.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: tasks?.length || 0,
    pending: tasks?.filter(t => t.status === 'pending').length || 0,
    in_progress: tasks?.filter(t => t.status === 'in_progress').length || 0,
    completed: tasks?.filter(t => t.status === 'completed').length || 0,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">টাস্ক ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">সকল টাস্ক পরিচালনা করুন</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> নতুন টাস্ক
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold">{stats.total}</p>
            <p className="text-sm text-muted-foreground">মোট টাস্ক</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-muted-foreground">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">অপেক্ষমাণ</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-primary">{stats.in_progress}</p>
            <p className="text-sm text-muted-foreground">চলমান</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-2xl font-bold text-success">{stats.completed}</p>
            <p className="text-sm text-muted-foreground">সম্পন্ন</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="টাস্ক খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>টাস্ক তালিকা</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">লোড হচ্ছে...</div>
          ) : filteredTasks?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">কোনো টাস্ক নেই</div>
          ) : (
            <div className="space-y-3">
              {filteredTasks?.map((task) => {
                const status = statusConfig[task.status as keyof typeof statusConfig] || statusConfig.pending;
                const priority = priorityConfig[task.priority as keyof typeof priorityConfig] || priorityConfig.medium;
                const StatusIcon = status.icon;
                return (
                  <div key={task.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                    <StatusIcon className={`h-5 w-5 ${task.status === 'completed' ? 'text-success' : 'text-muted-foreground'}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                        {task.title}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {task.projects?.name && (
                          <span className="text-xs text-muted-foreground">📁 {task.projects.name}</span>
                        )}
                        {task.employees?.full_name && (
                          <span className="text-xs text-muted-foreground">👤 {task.employees.full_name}</span>
                        )}
                        {task.due_date && (
                          <span className="text-xs text-muted-foreground">
                            📅 {format(new Date(task.due_date), 'dd MMM', { locale: bn })}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge className={priority.color}>{priority.label}</Badge>
                    <Badge className={status.color}>{status.label}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(task)}>
                          <Edit className="mr-2 h-4 w-4" /> এডিট
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => { setSelectedTask(task); setDeleteDialogOpen(true); }}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> ডিলিট
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedTask ? 'টাস্ক এডিট' : 'নতুন টাস্ক'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>টাস্কের নাম *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>বিবরণ</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>প্রজেক্ট</Label>
                <Select
                  value={formData.project_id}
                  onValueChange={(value) => setFormData({ ...formData, project_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>অ্যাসাইন</Label>
                <Select
                  value={formData.assigned_to}
                  onValueChange={(value) => setFormData({ ...formData, assigned_to: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="নির্বাচন করুন" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map((e) => (
                      <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>ডেডলাইন</Label>
                <Input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>প্রায়োরিটি</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>{config.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
        onConfirm={() => selectedTask && deleteMutation.mutate(selectedTask.id)}
        title="টাস্ক ডিলিট করুন"
        description="আপনি কি নিশ্চিত এই টাস্কটি ডিলিট করতে চান?"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
