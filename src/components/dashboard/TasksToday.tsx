import { CheckCircle2, Circle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useTodayTasks, useToggleTaskStatus } from "@/hooks/useTasks";

const priorityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground border-border",
};

const priorityLabels: Record<string, string> = {
  high: "উচ্চ",
  medium: "মধ্যম",
  low: "নিম্ন",
};

function formatTime(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBangla = (num: number) => num.toString().padStart(2, '0').split('').map(d => banglaDigits[parseInt(d)] || d).join('');
  return `${toBangla(hours)}:${toBangla(minutes)}`;
}

export function TasksToday() {
  const { data: tasks, isLoading } = useTodayTasks();
  const toggleMutation = useToggleTaskStatus();

  const handleToggle = (id: string, currentStatus: string | null) => {
    const isCurrentlyCompleted = currentStatus === "completed";
    toggleMutation.mutate({ id, isCompleted: !isCurrentlyCompleted });
  };

  const completedCount = tasks?.filter((t) => t.status === "completed").length || 0;
  const totalCount = tasks?.length || 0;

  if (isLoading) {
    return (
      <div className="chart-container flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">আজকের টাস্ক</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{totalCount} সম্পন্ন
          </p>
        </div>
        <button className="text-sm text-primary hover:underline">
          সব দেখুন
        </button>
      </div>

      {tasks && tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          আজকের জন্য কোনো টাস্ক নেই
        </div>
      ) : (
        <div className="space-y-2">
          {tasks?.map((task) => {
            const isCompleted = task.status === "completed";
            const priority = task.priority || "medium";
            return (
              <div
                key={task.id}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg border border-transparent transition-all cursor-pointer",
                  isCompleted
                    ? "bg-muted/30 opacity-60"
                    : "hover:bg-muted/50 hover:border-border"
                )}
                onClick={() => handleToggle(task.id, task.status)}
              >
                <button className="mt-0.5 shrink-0" disabled={toggleMutation.isPending}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "font-medium",
                      isCompleted && "line-through text-muted-foreground"
                    )}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {task.project?.name || "সাধারণ"}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] px-1.5", priorityColors[priority])}
                    >
                      {priorityLabels[priority] || priority}
                    </Badge>
                  </div>
                </div>
                {task.due_date && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <Clock className="h-3 w-3" />
                    {formatTime(task.created_at)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
