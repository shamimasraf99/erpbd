import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  gradient: "primary" | "success" | "accent" | "warning";
  className?: string;
}

const gradientClasses = {
  primary: "from-primary/20 to-primary/5",
  success: "from-success/20 to-success/5",
  accent: "from-accent/20 to-accent/5",
  warning: "from-warning/20 to-warning/5",
};

const iconBgClasses = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  accent: "bg-accent/10 text-accent",
  warning: "bg-warning/10 text-warning",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  change,
  gradient,
  className,
}: StatCardProps) {
  return (
    <div className={cn("stat-card group", className)}>
      {/* Gradient Background */}
      <div
        className={cn(
          "stat-card-gradient bg-gradient-to-br",
          gradientClasses[gradient]
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <h3 className="text-3xl font-bold">{value}</h3>
          </div>
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110",
              iconBgClasses[gradient]
            )}
          >
            <Icon className="h-6 w-6" />
          </div>
        </div>

        {change && (
          <div className="mt-4 flex items-center gap-1">
            <span
              className={cn(
                "text-sm font-medium",
                change.type === "increase" ? "text-success" : "text-destructive"
              )}
            >
              {change.type === "increase" ? "+" : "-"}
              {Math.abs(change.value)}%
            </span>
            <span className="text-sm text-muted-foreground">
              গত মাসের তুলনায়
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
