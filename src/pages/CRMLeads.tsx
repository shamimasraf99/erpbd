import { useState } from "react";
import { Plus, Search, Filter, LayoutGrid, List, MoreHorizontal, Phone, Mail, Building2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLeads } from "@/hooks/useLeads";

const stages = ["new", "contacted", "proposal", "negotiation", "won"] as const;

const stageLabels: Record<string, string> = {
  "new": "নতুন",
  "contacted": "যোগাযোগ",
  "proposal": "প্রস্তাব",
  "negotiation": "আলোচনা",
  "won": "সম্পন্ন",
};

const stageColors: Record<string, string> = {
  "new": "bg-primary/10 text-primary border-primary/30",
  "contacted": "bg-info/10 text-info border-info/30",
  "proposal": "bg-warning/10 text-warning border-warning/30",
  "negotiation": "bg-accent/10 text-accent border-accent/30",
  "won": "bg-success/10 text-success border-success/30",
};

const stageHeaderColors: Record<string, string> = {
  "new": "border-t-primary",
  "contacted": "border-t-info",
  "proposal": "border-t-warning",
  "negotiation": "border-t-accent",
  "won": "border-t-success",
};

function formatCurrency(value: number | null) {
  if (!value) return "৳০";
  return `৳${value.toLocaleString('bn-BD')}`;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
}

export default function CRMLeads() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const { data: leads = [], isLoading, error } = useLeads();

  const getLeadsByStage = (stage: typeof stages[number]) => {
    return leads.filter((lead) => (lead.stage || 'new') === stage);
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-2xl font-bold">লিড ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">সম্ভাব্য ক্লায়েন্টদের ট্র্যাক করুন</p>
        </div>
        <Button className="btn-gradient gap-2">
          <Plus className="h-4 w-4" />
          নতুন লিড
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="লিড খুঁজুন..."
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
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("kanban")}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            কানবান
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
      {!isLoading && leads.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground mb-2">কোনো লিড পাওয়া যায়নি</p>
          <Button className="btn-gradient gap-2">
            <Plus className="h-4 w-4" />
            প্রথম লিড যোগ করুন
          </Button>
        </div>
      )}

      {/* Kanban View */}
      {!isLoading && viewMode === "kanban" && leads.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div key={stage} className="min-w-[280px]">
              <div className={cn("kanban-column border-t-4", stageHeaderColors[stage])}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{stageLabels[stage]}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {getLeadsByStage(stage).length}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-3">
                  {getLeadsByStage(stage).map((lead) => (
                    <div key={lead.id} className="kanban-card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium">{lead.name}</h4>
                          {lead.company && (
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {lead.company}
                            </p>
                          )}
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2 mb-3">
                        {lead.email && (
                          <p className="text-sm flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            {lead.email}
                          </p>
                        )}
                        {lead.phone && (
                          <p className="text-sm flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-3 w-3" />
                            {lead.phone}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="text-sm font-semibold text-success">
                          {formatCurrency(lead.estimated_value)}
                        </span>
                        {lead.source && (
                          <Badge variant="outline" className="text-xs">
                            {lead.source}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!isLoading && viewMode === "list" && leads.length > 0 && (
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium">নাম</th>
                <th className="text-left p-4 font-medium">কোম্পানি</th>
                <th className="text-left p-4 font-medium">ইমেইল</th>
                <th className="text-left p-4 font-medium">মূল্য</th>
                <th className="text-left p-4 font-medium">উৎস</th>
                <th className="text-left p-4 font-medium">স্টেজ</th>
                <th className="text-left p-4 font-medium">তারিখ</th>
                <th className="text-right p-4 font-medium">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-medium">{lead.name}</td>
                  <td className="p-4 text-muted-foreground">{lead.company || '-'}</td>
                  <td className="p-4 text-muted-foreground">{lead.email || '-'}</td>
                  <td className="p-4 font-medium text-success">{formatCurrency(lead.estimated_value)}</td>
                  <td className="p-4">
                    {lead.source && <Badge variant="secondary">{lead.source}</Badge>}
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className={stageColors[lead.stage || 'new']}>
                      {stageLabels[lead.stage || 'new']}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">{formatDate(lead.created_at)}</td>
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
