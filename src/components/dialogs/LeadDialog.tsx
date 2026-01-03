import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { Lead } from "@/hooks/useLeads";

interface LeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: Lead | null;
}

export function LeadDialog({ open, onOpenChange, lead }: LeadDialogProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    estimated_value: "",
    source: "",
    stage: "new",
    notes: "",
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        company: lead.company || "",
        email: lead.email || "",
        phone: lead.phone || "",
        estimated_value: lead.estimated_value?.toString() || "",
        source: lead.source || "",
        stage: lead.stage || "new",
        notes: lead.notes || "",
      });
    } else {
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        estimated_value: "",
        source: "",
        stage: "new",
        notes: "",
      });
    }
  }, [lead, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        name: formData.name,
        company: formData.company || null,
        email: formData.email || null,
        phone: formData.phone || null,
        estimated_value: formData.estimated_value ? parseFloat(formData.estimated_value) : null,
        source: formData.source || null,
        stage: formData.stage,
        notes: formData.notes || null,
      };

      if (lead) {
        const { error } = await supabase
          .from("leads")
          .update(dataToSave)
          .eq("id", lead.id);
        if (error) throw error;
        toast.success("লিড আপডেট করা হয়েছে");
      } else {
        const { error } = await supabase.from("leads").insert(dataToSave);
        if (error) throw error;
        toast.success("নতুন লিড যোগ করা হয়েছে");
      }

      queryClient.invalidateQueries({ queryKey: ["leads"] });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{lead ? "লিড এডিট করুন" : "নতুন লিড যোগ করুন"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">নাম *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">কোম্পানি</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">ইমেইল</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">ফোন</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_value">আনুমানিক মূল্য</Label>
              <Input
                id="estimated_value"
                type="number"
                value={formData.estimated_value}
                onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">উৎস</Label>
              <Input
                id="source"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                placeholder="যেমন: ওয়েবসাইট, রেফারেল"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>স্টেজ</Label>
            <Select
              value={formData.stage}
              onValueChange={(value) => setFormData({ ...formData, stage: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">নতুন</SelectItem>
                <SelectItem value="contacted">যোগাযোগ</SelectItem>
                <SelectItem value="proposal">প্রস্তাব</SelectItem>
                <SelectItem value="negotiation">আলোচনা</SelectItem>
                <SelectItem value="won">সম্পন্ন</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">নোট</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              বাতিল
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {lead ? "আপডেট করুন" : "যোগ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
