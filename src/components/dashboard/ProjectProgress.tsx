import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  name: string;
  client: string;
  progress: number;
  status: "চলমান" | "সম্পন্ন" | "বিলম্বিত" | "নতুন";
  dueDate: string;
}

const projects: Project[] = [
  {
    id: 1,
    name: "ই-কমার্স ওয়েবসাইট",
    client: "টেক সলিউশন্স",
    progress: 75,
    status: "চলমান",
    dueDate: "১৫ জানু ২০২৫",
  },
  {
    id: 2,
    name: "মোবাইল অ্যাপ ডেভেলপমেন্ট",
    client: "গ্রিন এনার্জি লিমিটেড",
    progress: 45,
    status: "চলমান",
    dueDate: "২০ ফেব ২০২৫",
  },
  {
    id: 3,
    name: "ERP সিস্টেম আপগ্রেড",
    client: "ব্লু স্কাই কর্পোরেশন",
    progress: 100,
    status: "সম্পন্ন",
    dueDate: "১০ ডিসে ২০২৪",
  },
  {
    id: 4,
    name: "ক্লাউড মাইগ্রেশন",
    client: "ডিজিটাল ফার্স্ট",
    progress: 30,
    status: "বিলম্বিত",
    dueDate: "০৫ জানু ২০২৫",
  },
  {
    id: 5,
    name: "ডাটা অ্যানালিটিক্স প্ল্যাটফর্ম",
    client: "ফাইন্যান্স প্রো",
    progress: 10,
    status: "নতুন",
    dueDate: "২৮ মার্চ ২০২৫",
  },
];

const statusColors = {
  চলমান: "bg-primary/10 text-primary border-primary/20",
  সম্পন্ন: "bg-success/10 text-success border-success/20",
  বিলম্বিত: "bg-destructive/10 text-destructive border-destructive/20",
  নতুন: "bg-accent/10 text-accent border-accent/20",
};

const progressColors = {
  চলমান: "bg-primary",
  সম্পন্ন: "bg-success",
  বিলম্বিত: "bg-destructive",
  নতুন: "bg-accent",
};

export function ProjectProgress() {
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

      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-medium">{project.name}</h4>
                <p className="text-sm text-muted-foreground">{project.client}</p>
              </div>
              <Badge
                variant="outline"
                className={cn("text-xs", statusColors[project.status])}
              >
                {project.status}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">অগ্রগতি</span>
                <span className="font-medium">{project.progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    progressColors[project.status]
                  )}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                শেষ তারিখ: {project.dueDate}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
