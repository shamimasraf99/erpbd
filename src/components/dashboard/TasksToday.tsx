import { useState } from "react";
import { CheckCircle2, Circle, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Task {
  id: number;
  title: string;
  project: string;
  priority: "উচ্চ" | "মধ্যম" | "নিম্ন";
  time: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: "ক্লায়েন্ট মিটিং - প্রজেক্ট রিকোয়ারমেন্ট",
    project: "টেক সলিউশন্স",
    priority: "উচ্চ",
    time: "১০:০০",
    completed: true,
  },
  {
    id: 2,
    title: "UI ডিজাইন রিভিউ ও ফিডব্যাক",
    project: "ই-কমার্স প্রজেক্ট",
    priority: "উচ্চ",
    time: "১১:৩০",
    completed: true,
  },
  {
    id: 3,
    title: "ডেভেলপমেন্ট টিম স্ট্যান্ডআপ",
    project: "দৈনিক",
    priority: "মধ্যম",
    time: "১২:০০",
    completed: false,
  },
  {
    id: 4,
    title: "ইনভয়েস জেনারেশন ও পাঠানো",
    project: "হিসাব",
    priority: "মধ্যম",
    time: "১৪:০০",
    completed: false,
  },
  {
    id: 5,
    title: "কোড রিভিউ - পেমেন্ট মডিউল",
    project: "ERP আপগ্রেড",
    priority: "উচ্চ",
    time: "১৫:৩০",
    completed: false,
  },
  {
    id: 6,
    title: "সাপ্তাহিক রিপোর্ট প্রস্তুত",
    project: "অ্যাডমিন",
    priority: "নিম্ন",
    time: "১৭:০০",
    completed: false,
  },
];

const priorityColors = {
  উচ্চ: "bg-destructive/10 text-destructive border-destructive/20",
  মধ্যম: "bg-warning/10 text-warning border-warning/20",
  নিম্ন: "bg-muted text-muted-foreground border-border",
};

export function TasksToday() {
  const [tasks, setTasks] = useState(initialTasks);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">আজকের টাস্ক</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{tasks.length} সম্পন্ন
          </p>
        </div>
        <button className="text-sm text-primary hover:underline">
          সব দেখুন
        </button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border border-transparent transition-all cursor-pointer",
              task.completed
                ? "bg-muted/30 opacity-60"
                : "hover:bg-muted/50 hover:border-border"
            )}
            onClick={() => toggleTask(task.id)}
          >
            <button className="mt-0.5 shrink-0">
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "font-medium",
                  task.completed && "line-through text-muted-foreground"
                )}
              >
                {task.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">
                  {task.project}
                </span>
                <Badge
                  variant="outline"
                  className={cn("text-[10px] px-1.5", priorityColors[task.priority])}
                >
                  {task.priority}
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
              <Clock className="h-3 w-3" />
              {task.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
