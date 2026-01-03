import { Users, Briefcase, FileText, FolderKanban, Loader2 } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ProjectProgress } from "@/components/dashboard/ProjectProgress";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { TasksToday } from "@/components/dashboard/TasksToday";
import { LeadsPipeline } from "@/components/dashboard/LeadsPipeline";
import { UpcomingMeetings } from "@/components/dashboard/UpcomingMeetings";
import { useDashboardStats } from "@/hooks/useDashboardStats";

function formatCurrency(value: number) {
  if (value >= 100000) {
    return `৳${(value / 100000).toFixed(1)} লাখ`;
  }
  return `৳${value.toLocaleString('bn-BD')}`;
}

function toBanglaNumber(num: number): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(d => banglaDigits[parseInt(d)] || d).join('');
}

export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">ড্যাশবোর্ড</h1>
          <p className="text-muted-foreground">স্বাগতম! আজকের ওভারভিউ দেখুন।</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm input-bangla">
            <option>এই মাস</option>
            <option>গত মাস</option>
            <option>এই বছর</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="মোট ক্লায়েন্ট"
            value={toBanglaNumber(stats?.clients || 0)}
            icon={Users}
            change={{ value: 12, type: "increase" }}
            gradient="primary"
          />
          <StatCard
            title="মোট কর্মী"
            value={toBanglaNumber(stats?.employees || 0)}
            icon={Briefcase}
            change={{ value: 5, type: "increase" }}
            gradient="success"
          />
          <StatCard
            title="মোট ইনভয়েস"
            value={formatCurrency(stats?.invoiceTotal || 0)}
            icon={FileText}
            change={{ value: 8, type: "increase" }}
            gradient="warning"
          />
          <StatCard
            title="চলমান প্রজেক্ট"
            value={toBanglaNumber(stats?.activeProjects || 0)}
            icon={FolderKanban}
            change={{ value: 3, type: "decrease" }}
            gradient="accent"
          />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <LeadsPipeline />
        </div>
      </div>

      {/* Middle Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TasksToday />
        <UpcomingMeetings />
      </div>

      {/* Bottom Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ProjectProgress />
        <RecentActivities />
      </div>
    </div>
  );
}
