import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Plus, Mail, Edit, Trash2, Copy, Eye, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DeleteConfirmDialog } from '@/components/dialogs/DeleteConfirmDialog';

const categories = [
  { value: 'invoice', label: 'ইনভয়েস' },
  { value: 'welcome', label: 'স্বাগতম' },
  { value: 'reminder', label: 'রিমাইন্ডার' },
  { value: 'notification', label: 'নোটিফিকেশন' },
  { value: 'marketing', label: 'মার্কেটিং' },
];

// Demo templates
const initialTemplates = [
  {
    id: '1',
    name: 'নতুন ক্লায়েন্ট স্বাগতম',
    category: 'welcome',
    subject: 'স্বাগতম! আমাদের সাথে যুক্ত হওয়ার জন্য ধন্যবাদ',
    body: 'প্রিয় {{client_name}},\n\nআমাদের সেবায় যুক্ত হওয়ার জন্য আপনাকে স্বাগতম।\n\nআমরা আপনার সাথে কাজ করতে উৎসুক।\n\nধন্যবাদ,\n{{company_name}}',
    createdAt: '২০২৫-০১-০১',
  },
  {
    id: '2',
    name: 'ইনভয়েস পাঠানো',
    category: 'invoice',
    subject: 'ইনভয়েস #{{invoice_number}} - {{company_name}}',
    body: 'প্রিয় {{client_name}},\n\nআপনার ইনভয়েস #{{invoice_number}} সংযুক্ত করা হলো।\n\nমোট পরিমাণ: {{total_amount}}\nপরিশোধের শেষ তারিখ: {{due_date}}\n\nধন্যবাদ,\n{{company_name}}',
    createdAt: '২০২৫-০১-০১',
  },
  {
    id: '3',
    name: 'পেমেন্ট রিমাইন্ডার',
    category: 'reminder',
    subject: 'পেমেন্ট রিমাইন্ডার - ইনভয়েস #{{invoice_number}}',
    body: 'প্রিয় {{client_name}},\n\nএটি একটি বন্ধুত্বপূর্ণ রিমাইন্ডার যে ইনভয়েস #{{invoice_number}} এর পেমেন্ট বকেয়া আছে।\n\nবকেয়া পরিমাণ: {{amount_due}}\n\nদয়া করে যত তাড়াতাড়ি সম্ভব পেমেন্ট করুন।\n\nধন্যবাদ,\n{{company_name}}',
    createdAt: '২০২৫-০১-০২',
  },
  {
    id: '4',
    name: 'প্রজেক্ট সম্পন্ন',
    category: 'notification',
    subject: 'প্রজেক্ট "{{project_name}}" সম্পন্ন হয়েছে',
    body: 'প্রিয় {{client_name}},\n\nআমরা আনন্দের সাথে জানাচ্ছি যে আপনার প্রজেক্ট "{{project_name}}" সফলভাবে সম্পন্ন হয়েছে।\n\nআপনার ফিডব্যাক আমাদের কাছে অত্যন্ত মূল্যবান।\n\nধন্যবাদ,\n{{company_name}}',
    createdAt: '২০২৫-০১-০৩',
  },
  {
    id: '5',
    name: 'বিশেষ অফার',
    category: 'marketing',
    subject: '🎉 বিশেষ অফার - ২০% ছাড়!',
    body: 'প্রিয় {{client_name}},\n\nআমাদের বিশেষ অফারে আপনি পাচ্ছেন ২০% ছাড়!\n\nঅফার শেষ: {{offer_end_date}}\n\nএই সুযোগ মিস করবেন না!\n\nধন্যবাদ,\n{{company_name}}',
    createdAt: '২০২৫-০১-০৩',
  },
];

export default function EmailTemplates() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [searchQuery, setSearchQuery] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'notification',
    subject: '',
    body: '',
  });

  const resetForm = () => {
    setFormData({ name: '', category: 'notification', subject: '', body: '' });
    setSelectedTemplate(null);
  };

  const handleEdit = (template: any) => {
    setSelectedTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      subject: template.subject,
      body: template.body,
    });
    setDialogOpen(true);
  };

  const handlePreview = (template: any) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.subject.trim()) {
      toast.error('নাম এবং সাবজেক্ট দিন');
      return;
    }

    if (selectedTemplate) {
      setTemplates(templates.map(t => 
        t.id === selectedTemplate.id 
          ? { ...t, ...formData }
          : t
      ));
      toast.success('টেমপ্লেট আপডেট হয়েছে');
    } else {
      const newTemplate = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toLocaleDateString('bn-BD'),
      };
      setTemplates([...templates, newTemplate]);
      toast.success('টেমপ্লেট যোগ করা হয়েছে');
    }
    setDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedTemplate) {
      setTemplates(templates.filter(t => t.id !== selectedTemplate.id));
      toast.success('টেমপ্লেট মুছে ফেলা হয়েছে');
      setDeleteDialogOpen(false);
      setSelectedTemplate(null);
    }
  };

  const handleCopy = (template: any) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (কপি)`,
      createdAt: new Date().toLocaleDateString('bn-BD'),
    };
    setTemplates([...templates, newTemplate]);
    toast.success('টেমপ্লেট কপি করা হয়েছে');
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryLabel = (value: string) => {
    return categories.find(c => c.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">ইমেইল টেমপ্লেট</h1>
          <p className="text-muted-foreground">ইমেইল টেমপ্লেট তৈরি ও পরিচালনা করুন</p>
        </div>
        <Button onClick={() => { resetForm(); setDialogOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> নতুন টেমপ্লেট
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {categories.map((cat) => (
          <Card key={cat.value}>
            <CardContent className="pt-6">
              <p className="text-2xl font-bold">
                {templates.filter(t => t.category === cat.value).length}
              </p>
              <p className="text-sm text-muted-foreground">{cat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="টেমপ্লেট খুঁজুন..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">
            কোনো টেমপ্লেট নেই
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{template.name}</CardTitle>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handlePreview(template)}>
                        <Eye className="mr-2 h-4 w-4" /> প্রিভিউ
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(template)}>
                        <Edit className="mr-2 h-4 w-4" /> এডিট
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleCopy(template)}>
                        <Copy className="mr-2 h-4 w-4" /> কপি
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => { setSelectedTemplate(template); setDeleteDialogOpen(true); }}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> ডিলিট
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="mb-2">
                  {getCategoryLabel(template.category)}
                </Badge>
                <p className="text-sm font-medium mb-1">{template.subject}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.body.substring(0, 100)}...
                </p>
                <p className="text-xs text-muted-foreground mt-3">
                  তৈরি: {template.createdAt}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedTemplate ? 'টেমপ্লেট এডিট' : 'নতুন টেমপ্লেট'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>টেমপ্লেট নাম *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>সাবজেক্ট *</Label>
              <Input
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>বডি</Label>
              <Textarea
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                rows={8}
                placeholder="ভেরিয়েবল ব্যবহার করুন: {{client_name}}, {{company_name}}, {{invoice_number}} ইত্যাদি"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                বাতিল
              </Button>
              <Button type="submit">সেভ করুন</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>টেমপ্লেট প্রিভিউ</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">সাবজেক্ট:</p>
                <p className="font-medium">{selectedTemplate.subject}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">বডি:</p>
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {selectedTemplate.body}
                </pre>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="টেমপ্লেট ডিলিট করুন"
        description="আপনি কি নিশ্চিত এই টেমপ্লেটটি ডিলিট করতে চান?"
      />
    </div>
  );
}
