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
import type { Invoice } from "@/hooks/useInvoices";
import { invoiceSchema, getFirstErrorMessage } from "@/lib/validations";

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoice?: Invoice | null;
}

export function InvoiceDialog({ open, onOpenChange, invoice }: InvoiceDialogProps) {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);
  const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
  
  const [formData, setFormData] = useState({
    invoice_number: "",
    client_id: "",
    project_id: "",
    amount: "",
    tax_amount: "",
    status: "draft",
    issue_date: new Date().toISOString().split("T")[0],
    due_date: "",
    notes: "",
  });

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoice_number: invoice.invoice_number,
        client_id: invoice.client_id || "",
        project_id: invoice.project_id || "",
        amount: invoice.amount.toString(),
        tax_amount: invoice.tax_amount?.toString() || "0",
        status: invoice.status || "draft",
        issue_date: invoice.issue_date,
        due_date: invoice.due_date,
        notes: invoice.notes || "",
      });
    } else {
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + 30);
      
      setFormData({
        invoice_number: `INV-${Date.now().toString().slice(-6)}`,
        client_id: "",
        project_id: "",
        amount: "",
        tax_amount: "0",
        status: "draft",
        issue_date: today.toISOString().split("T")[0],
        due_date: dueDate.toISOString().split("T")[0],
        notes: "",
      });
    }
  }, [invoice, open]);

  useEffect(() => {
    async function fetchData() {
      const [clientsRes, projectsRes] = await Promise.all([
        supabase.from("clients").select("id, name"),
        supabase.from("projects").select("id, name"),
      ]);
      if (clientsRes.data) setClients(clientsRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data with Zod schema
    const result = invoiceSchema.safeParse(formData);
    if (!result.success) {
      toast.error(getFirstErrorMessage(result.error));
      return;
    }
    
    setLoading(true);

    try {
      const amount = parseFloat(formData.amount) || 0;
      const taxAmount = parseFloat(formData.tax_amount) || 0;
      
      const dataToSave = {
        invoice_number: formData.invoice_number,
        client_id: formData.client_id || null,
        project_id: formData.project_id || null,
        amount: amount,
        tax_amount: taxAmount,
        total_amount: amount + taxAmount,
        status: formData.status,
        issue_date: formData.issue_date,
        due_date: formData.due_date,
        notes: formData.notes || null,
      };

      if (invoice) {
        const { error } = await supabase
          .from("invoices")
          .update(dataToSave)
          .eq("id", invoice.id);
        if (error) throw error;
        toast.success("ইনভয়েস আপডেট করা হয়েছে");
      } else {
        const { error } = await supabase.from("invoices").insert(dataToSave);
        if (error) throw error;
        toast.success("নতুন ইনভয়েস যোগ করা হয়েছে");
      }

      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice-stats"] });
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = (parseFloat(formData.amount) || 0) + (parseFloat(formData.tax_amount) || 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{invoice ? "ইনভয়েস এডিট করুন" : "নতুন ইনভয়েস যোগ করুন"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoice_number">ইনভয়েস নং *</Label>
              <Input
                id="invoice_number"
                value={formData.invoice_number}
                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                required
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
                  <SelectItem value="draft">ড্রাফট</SelectItem>
                  <SelectItem value="pending">পেন্ডিং</SelectItem>
                  <SelectItem value="paid">পেইড</SelectItem>
                  <SelectItem value="overdue">ওভারডিউ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
              <Label>প্রজেক্ট</Label>
              <Select
                value={formData.project_id}
                onValueChange={(value) => setFormData({ ...formData, project_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="প্রজেক্ট নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">পরিমাণ *</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tax_amount">ট্যাক্স</Label>
              <Input
                id="tax_amount"
                type="number"
                value={formData.tax_amount}
                onChange={(e) => setFormData({ ...formData, tax_amount: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>মোট</Label>
              <Input
                value={`৳${totalAmount.toLocaleString('bn-BD')}`}
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue_date">ইস্যু তারিখ</Label>
              <Input
                id="issue_date"
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">শেষ তারিখ</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">নোট</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              বাতিল
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {invoice ? "আপডেট করুন" : "যোগ করুন"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
