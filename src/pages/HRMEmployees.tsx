import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEmployees, Employee } from "@/hooks/useEmployees";
import { EmployeeDialog } from "@/components/dialogs/EmployeeDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors: Record<string, string> = {
  "active": "bg-success/10 text-success border-success/30",
  "on_leave": "bg-warning/10 text-warning border-warning/30",
  "inactive": "bg-destructive/10 text-destructive border-destructive/30",
};

const statusLabels: Record<string, string> = {
  "active": "সক্রিয়",
  "on_leave": "ছুটিতে",
  "inactive": "নিষ্ক্রিয়",
};

const departmentColors: Record<string, string> = {
  "প্রযুক্তি": "bg-primary/10 text-primary",
  "ডিজাইন": "bg-accent/10 text-accent",
  "অপারেশন": "bg-warning/10 text-warning",
  "মানব সম্পদ": "bg-success/10 text-success",
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2);
}

export default function HRMEmployees() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { data: employees = [], isLoading, error } = useEmployees();
  const queryClient = useQueryClient();

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.designation?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (emp.department_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDialogOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedEmployee) return;
    setDeleteLoading(true);
    
    try {
      const { error } = await supabase
        .from("employees")
        .delete()
        .eq("id", selectedEmployee.id);
      
      if (error) throw error;
      
      toast.success("কর্মী ডিলিট করা হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "ডিলিট করতে সমস্যা হয়েছে");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedEmployee(null);
    setDialogOpen(true);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">ডেটা লোড করতে সমস্যা হয়েছে</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">কর্মী তালিকা</h1>
          <p className="text-muted-foreground">মোট {employees.length} জন কর্মী</p>
        </div>
        <Button className="btn-gradient gap-2" onClick={handleAddNew}>
          <Plus className="h-4 w-4" />
          নতুন কর্মী যোগ করুন
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="কর্মী খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-80 input-bangla"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            ফিল্টার
          </Button>
          <select className="px-3 py-2 rounded-lg border border-input bg-background text-sm input-bangla">
            <option>সব বিভাগ</option>
            <option>প্রযুক্তি</option>
            <option>ডিজাইন</option>
            <option>অপারেশন</option>
            <option>মানব সম্পদ</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredEmployees.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground mb-2">কোনো কর্মী পাওয়া যায়নি</p>
          <Button className="btn-gradient gap-2" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            প্রথম কর্মী যোগ করুন
          </Button>
        </div>
      )}

      {/* Employee Cards */}
      {!isLoading && filteredEmployees.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <div
              key={employee.id}
              className="stat-card hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {getInitials(employee.full_name)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{employee.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{employee.designation || 'পদবি নেই'}</p>
                    {employee.department_name && (
                      <Badge
                        variant="secondary"
                        className={cn("mt-1 text-xs", departmentColors[employee.department_name] || "bg-muted")}
                      >
                        {employee.department_name}
                      </Badge>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(employee)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      এডিট করুন
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(employee)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      ডিলিট করুন
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mt-4 pt-4 border-t border-border space-y-2">
                <p className="text-sm flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  {employee.email}
                </p>
                {employee.phone && (
                  <p className="text-sm flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {employee.phone}
                  </p>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  যোগদান: {formatDate(employee.join_date)}
                </span>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", statusColors[employee.status || 'active'])}
                >
                  {statusLabels[employee.status || 'active']}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      <EmployeeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        employee={selectedEmployee}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="কর্মী ডিলিট করুন"
        description={`আপনি কি "${selectedEmployee?.full_name}" কে ডিলিট করতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`}
      />
    </div>
  );
}
