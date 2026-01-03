import { useState } from "react";
import { Plus, Search, Filter, LayoutGrid, List, MoreHorizontal, Calendar, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Project {
  id: number;
  name: string;
  client: string;
  description: string;
  progress: number;
  status: "পরিকল্পনা" | "চলমান" | "সম্পন্ন" | "বিলম্বিত" | "হোল্ড";
  startDate: string;
  endDate: string;
  budget: string;
  team: string[];
  priority: "উচ্চ" | "মধ্যম" | "নিম্ন";
}

const projects: Project[] = [
  { id: 1, name: "ই-কমার্স ওয়েবসাইট ডেভেলপমেন্ট", client: "টেক সলিউশন্স", description: "পূর্ণাঙ্গ ই-কমার্স প্ল্যাটফর্ম তৈরি", progress: 75, status: "চলমান", startDate: "০১ নভে ২০২৪", endDate: "১৫ জানু ২০২৫", budget: "৳১৫,০০,০০০", team: ["আ", "সা", "ত"], priority: "উচ্চ" },
  { id: 2, name: "মোবাইল অ্যাপ ডেভেলপমেন্ট", client: "গ্রিন এনার্জি", description: "iOS ও Android অ্যাপ", progress: 45, status: "চলমান", startDate: "১৫ ডিসে ২০২৪", endDate: "২০ ফেব ২০২৫", budget: "৳২২,৫০,০০০", team: ["র", "মা"], priority: "উচ্চ" },
  { id: 3, name: "ERP সিস্টেম আপগ্রেড", client: "ব্লু স্কাই কর্প", description: "বিদ্যমান ERP সিস্টেম আধুনিকায়ন", progress: 100, status: "সম্পন্ন", startDate: "০১ অক্টো ২০২৪", endDate: "১০ ডিসে ২০২৪", budget: "৳৩৫,০০,০০০", team: ["আ", "ফা", "ত", "র"], priority: "মধ্যম" },
  { id: 4, name: "ক্লাউড মাইগ্রেশন", client: "ডিজিটাল ফার্স্ট", description: "অন-প্রেমিস থেকে ক্লাউডে মাইগ্রেশন", progress: 30, status: "বিলম্বিত", startDate: "১০ ডিসে ২০২৪", endDate: "০৫ জানু ২০২৫", budget: "৳৮,৫০,০০০", team: ["মা", "সা"], priority: "উচ্চ" },
  { id: 5, name: "ডাটা অ্যানালিটিক্স প্ল্যাটফর্ম", client: "ফাইন্যান্স প্রো", description: "ব্যবসায়িক ডাটা বিশ্লেষণ টুল", progress: 10, status: "পরিকল্পনা", startDate: "২০ জানু ২০২৫", endDate: "২৮ মার্চ ২০২৫", budget: "৳১৮,০০,০০০", team: ["আ", "র"], priority: "মধ্যম" },
  { id: 6, name: "CRM সিস্টেম ইন্টিগ্রেশন", client: "স্মার্ট সার্ভিস", description: "বিদ্যমান সিস্টেমে CRM ইন্টিগ্রেট", progress: 60, status: "হোল্ড", startDate: "০১ ডিসে ২০২৪", endDate: "৩১ জানু ২০২৫", budget: "৳৬,০০,০০০", team: ["ত", "ফা"], priority: "নিম্ন" },
];

const statusColors = {
  "পরিকল্পনা": "bg-info/10 text-info border-info/30",
  "চলমান": "bg-primary/10 text-primary border-primary/30",
  "সম্পন্ন": "bg-success/10 text-success border-success/30",
  "বিলম্বিত": "bg-destructive/10 text-destructive border-destructive/30",
  "হোল্ড": "bg-warning/10 text-warning border-warning/30",
};

const priorityColors = {
  "উচ্চ": "text-destructive",
  "মধ্যম": "text-warning",
  "নিম্ন": "text-muted-foreground",
};

const progressColors = {
  "পরিকল্পনা": "bg-info",
  "চলমান": "bg-primary",
  "সম্পন্ন": "bg-success",
  "বিলম্বিত": "bg-destructive",
  "হোল্ড": "bg-warning",
};

export default function Projects() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">প্রজেক্ট ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">সকল প্রজেক্ট ট্র্যাক ও ম্যানেজ করুন</p>
        </div>
        <Button className="btn-gradient gap-2">
          <Plus className="h-4 w-4" />
          নতুন প্রজেক্ট
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "মোট প্রজেক্ট", value: projects.length, color: "text-foreground" },
          { label: "চলমান", value: projects.filter(p => p.status === "চলমান").length, color: "text-primary" },
          { label: "সম্পন্ন", value: projects.filter(p => p.status === "সম্পন্ন").length, color: "text-success" },
          { label: "বিলম্বিত", value: projects.filter(p => p.status === "বিলম্বিত").length, color: "text-destructive" },
          { label: "হোল্ড", value: projects.filter(p => p.status === "হোল্ড").length, color: "text-warning" },
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

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <div key={project.id} className="stat-card group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <Badge variant="outline" className={cn("text-xs mb-2", statusColors[project.status])}>
                    {project.status}
                  </Badge>
                  <h3 className="font-semibold line-clamp-1">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">{project.client}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                {project.description}
              </p>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">অগ্রগতি</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", progressColors[project.status])}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {project.endDate}
                  </div>
                  <span className={cn("font-medium", priorityColors[project.priority])}>
                    {project.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex -space-x-2">
                    {project.team.map((member, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center"
                      >
                        <span className="text-xs font-medium text-primary">{member}</span>
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-success">{project.budget}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
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
                <th className="text-left p-4 font-medium">টিম</th>
                <th className="text-right p-4 font-medium">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{project.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{project.client}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn("h-full rounded-full", progressColors[project.status])}
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={cn("text-xs", statusColors[project.status])}>
                      {project.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">{project.endDate}</td>
                  <td className="p-4 font-medium text-success">{project.budget}</td>
                  <td className="p-4">
                    <div className="flex -space-x-1">
                      {project.team.slice(0, 3).map((member, i) => (
                        <div
                          key={i}
                          className="h-7 w-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center"
                        >
                          <span className="text-[10px] font-medium text-primary">{member}</span>
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="h-7 w-7 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                          <span className="text-[10px] text-muted-foreground">+{project.team.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
