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
import type { Project } from "@/hooks/useProjects";

interface ProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project | null;
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  
  const [formData, setFormData] = useState({
    name: "",
    client_id: "",
    description: "",
    status: "planning",
    priority: "medium",
    progress: "0",
    budget: "",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name,
        client_id: project.client_id || "",
        description: project.description || "",
        status: project.status || "planning",
        priority: project.priority || "medium",
        progress: project.progress?.toString() || "0",
        budget: project.budget?.toString() || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
      });
    } else {
      setFormData({
        name: "",
        client_id: "",
        description: "",
        status: "planning",
        priority: "medium",
        progress: "0",
        budget: "",
        start_date: "",
        end_date: "",
      });
    }
  }, [project, open]);

  useEffect(() => {
    async function fetchClients() {
      const { data } = await supabase.from("clients").select("id, name");
      if (data) setClients(data);
    }
    fetchClients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        name: formData.name,
        client_id: formData.client_id || null,
        description: formData.description || null,
        status: formData.status,
        priority: formData.priority,
        progress: parseInt(formData.progress) || 0,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
      };

      if (project) {
        const { error } = await supabase
          .from("projects")
          .update(dataToSave)
          .eq("id", project.id);
        if (error) throw error;
        toast.success("প্রজেক্ট আপডেট করা হয়েছে");
      } else {
        const { error } = await supabase.from("projects").insert(dataToSave);
        if (error) throw error;
        toast.success("নতুন প্রজেক্ট যোগ করা হয়েছে");
      }

      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-stats"] });
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
          <DialogTitle>{project ? "প্রজেক্ট এডিট করুন" : "নতুন প্রজেক্ট যোগ করুন"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">প্রজেক্ট নাম *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>ক্লায়েন্ট</Label>
            <Select
              value={formData.client_id}
              onValueChange={(value) => setFormData({ ...formData, client_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="ক্লায়েন্ট নির্বাচন করুন" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">বিবরণ</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
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
                  <SelectItem value="planning">পরিকল্পনা</SelectItem>
                  <SelectItem value="in_progress">চলমান</SelectItem>
                  <SelectItem value="completed">সম্পন্ন</SelectItem>
                  <SelectItem value="delayed">বিলম্বিত</SelectItem>
                  <SelectItem value="on_hold">হোল্ড</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>অগ্রাধিকার</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">নিম্ন</SelectItem>
                  <SelectItem value="medium">মধ্যম</SelectItem>
                  <SelectItem value="high">উচ্চ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="progress">অগ্রগতি (%)</Label>
              <Input
                id="progress"
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({ ...formData, progress: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget">বাজেট</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">শুরু তারিখ</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">শেষ তারিখ</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              বাতিল
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {project ? "আপডেট করুন" : "যোগ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
