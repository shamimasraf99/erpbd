import { useState } from "react";
import { Plus, Search, Filter, LayoutGrid, List, MoreHorizontal, Calendar, Loader2, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useProjects, useProjectStats, Project } from "@/hooks/useProjects";
import { ProjectDialog } from "@/components/dialogs/ProjectDialog";
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
  "planning": "bg-info/10 text-info border-info/30",
  "in_progress": "bg-primary/10 text-primary border-primary/30",
  "completed": "bg-success/10 text-success border-success/30",
  "delayed": "bg-destructive/10 text-destructive border-destructive/30",
  "on_hold": "bg-warning/10 text-warning border-warning/30",
};

const statusLabels: Record<string, string> = {
  "planning": "পরিকল্পনা",
  "in_progress": "চলমান",
  "completed": "সম্পন্ন",
  "delayed": "বিলম্বিত",
  "on_hold": "হোল্ড",
};

const priorityColors: Record<string, string> = {
  "high": "text-destructive",
  "medium": "text-warning",
  "low": "text-muted-foreground",
};

const priorityLabels: Record<string, string> = {
  "high": "উচ্চ",
  "medium": "মধ্যম",
  "low": "নিম্ন",
};

const progressColors: Record<string, string> = {
  "planning": "bg-info",
  "in_progress": "bg-primary",
  "completed": "bg-success",
  "delayed": "bg-destructive",
  "on_hold": "bg-warning",
};

function formatCurrency(value: number | null) {
  if (!value) return "৳০";
  if (value >= 100000) {
    return `৳${(value / 100000).toFixed(2)} লাখ`;
  }
  return `৳${value.toLocaleString('bn-BD')}`;
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function Projects() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const { data: projects = [], isLoading, error } = useProjects();
  const { data: stats } = useProjectStats();
  const queryClient = useQueryClient();

  const filteredProjects = projects.filter(
    (proj) =>
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (proj.client_name?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedProject) return;
    setDeleteLoading(true);
    
    try {
      const { error } = await supabase
        .from("projects")
        .delete()
        .eq("id", selectedProject.id);
      
      if (error) throw error;
      
      toast.success("প্রজেক্ট ডিলিট করা হয়েছে");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project-stats"] });
      setDeleteDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || "ডিলিট করতে সমস্যা হয়েছে");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedProject(null);
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
          <h1 className="text-2xl font-bold">প্রজেক্ট ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">সকল প্রজেক্ট ট্র্যাক ও ম্যানেজ করুন</p>
        </div>
        <Button className="btn-gradient gap-2" onClick={handleAddNew}>
          <Plus className="h-4 w-4" />
          নতুন প্রজেক্ট
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "মোট প্রজেক্ট", value: stats?.total || 0, color: "text-foreground" },
          { label: "চলমান", value: stats?.ongoing || 0, color: "text-primary" },
          { label: "সম্পন্ন", value: stats?.completed || 0, color: "text-success" },
          { label: "বিলম্বিত", value: stats?.delayed || 0, color: "text-destructive" },
          { label: "হোল্ড", value: stats?.hold || 0, color: "text-warning" },
        ].map((stat) => (
          <div key={stat.label} className="stat-card text-center">
            <p className={cn("text-3xl font-bold", stat.color)}>{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="প্রজেক্ট খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64 input-bangla"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            গ্রিড
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4 mr-1" />
            তালিকা
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground mb-2">কোনো প্রজেক্ট পাওয়া যায়নি</p>
          <Button className="btn-gradient gap-2" onClick={handleAddNew}>
            <Plus className="h-4 w-4" />
            প্রথম প্রজেক্ট তৈরি করুন
          </Button>
        </div>
      )}

      {/* Grid View */}
      {!isLoading && viewMode === "grid" && filteredProjects.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div key={project.id} className="stat-card group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge variant="outline" className={cn("text-xs mb-2", statusColors[project.status || 'planning'])}>
                    {statusLabels[project.status || 'planning']}
                  </Badge>
                  <h3 className="font-semibold line-clamp-1">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.client_name || 'ক্লায়েন্ট নেই'}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(project)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      এডিট করুন
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleDelete(project)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      ডিলিট করুন
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {project.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {project.description}
                </p>
              )}

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">অগ্রগতি</span>
                    <span className="font-medium">{project.progress || 0}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", progressColors[project.status || 'planning'])}
                      style={{ width: `${project.progress || 0}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {formatDate(project.end_date)}
                  </div>
                  <span className={cn("font-medium", priorityColors[project.priority || 'medium'])}>
                    {priorityLabels[project.priority || 'medium']}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="text-sm font-semibold text-success">{formatCurrency(project.budget)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!isLoading && viewMode === "list" && filteredProjects.length > 0 && (
        <div className="table-container overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium">প্রজেক্ট</th>
                <th className="text-left p-4 font-medium">ক্লায়েন্ট</th>
                <th className="text-left p-4 font-medium">অগ্রগতি</th>
                <th className="text-left p-4 font-medium">স্ট্যাটাস</th>
                <th className="text-left p-4 font-medium">শেষ তারিখ</th>
                <th className="text-left p-4 font-medium">বাজেট</th>
                <th className="text-right p-4 font-medium">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      {project.description && (
                        <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{project.client_name || '-'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", progressColors[project.status || 'planning'])}
                          style={{ width: `${project.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-sm">{project.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={cn("text-xs", statusColors[project.status || 'planning'])}>
                      {statusLabels[project.status || 'planning']}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">{formatDate(project.end_date)}</td>
                  <td className="p-4 font-medium text-success">{formatCurrency(project.budget)}</td>
                  <td className="p-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(project)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          এডিট করুন
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(project)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          ডিলিট করুন
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        project={selectedProject}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        title="প্রজেক্ট ডিলিট করুন"
        description={`আপনি কি "${selectedProject?.name}" প্রজেক্ট ডিলিট করতে চান? এই কাজটি পূর্বাবস্থায় ফেরানো যাবে না।`}
      />
    </div>
  );
}
