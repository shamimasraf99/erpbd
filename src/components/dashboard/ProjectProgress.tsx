import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";

const statusColors: Record<string, string> = {
  "planning": "bg-info/10 text-info border-info/20",
  "in_progress": "bg-primary/10 text-primary border-primary/20",
  "completed": "bg-success/10 text-success border-success/20",
  "delayed": "bg-destructive/10 text-destructive border-destructive/20",
  "on_hold": "bg-warning/10 text-warning border-warning/20",
};

const statusLabels: Record<string, string> = {
  "planning": "পরিকল্পনা",
  "in_progress": "চলমান",
  "completed": "সম্পন্ন",
  "delayed": "বিলম্বিত",
  "on_hold": "হোল্ড",
};

const progressColors: Record<string, string> = {
  "planning": "bg-info",
  "in_progress": "bg-primary",
  "completed": "bg-success",
  "delayed": "bg-destructive",
  "on_hold": "bg-warning",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ProjectProgress() {
  const { data: projects = [], isLoading } = useProjects();

  // Show only the first 5 projects
  const displayedProjects = projects.slice(0, 5);

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">চলমান প্রজেক্ট</h3>
          <p className="text-sm text-muted-foreground">প্রজেক্ট অগ্রগতি ট্র্যাকার</p>
        </div>
        <button className="text-sm text-primary hover:underline">
          সব দেখুন
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : displayedProjects.length === 0 ? (
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">কোনো প্রজেক্ট নেই</p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedProjects.map((project) => (
            <div
              key={project.id}
              className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">{project.client_name || 'ক্লায়েন্ট নেই'}</p>
                </div>
                <Badge
                  variant="outline"
                  className={cn("text-xs", statusColors[project.status || 'planning'])}
                >
                  {statusLabels[project.status || 'planning']}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">অগ্রগতি</span>
                  <span className="font-medium">{project.progress || 0}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      progressColors[project.status || 'planning']
                    )}
                    style={{ width: `${project.progress || 0}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  শেষ তারিখ: {formatDate(project.end_date)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
