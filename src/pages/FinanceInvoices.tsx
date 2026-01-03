import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Download, Send, Eye, Printer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useInvoices, useInvoiceStats } from "@/hooks/useInvoices";

const statusColors: Record<string, string> = {
  "paid": "bg-success/10 text-success border-success/30",
  "pending": "bg-warning/10 text-warning border-warning/30",
  "overdue": "bg-destructive/10 text-destructive border-destructive/30",
  "draft": "bg-muted text-muted-foreground border-border",
};

const statusLabels: Record<string, string> = {
  "paid": "পেইড",
  "pending": "পেন্ডিং",
  "overdue": "ওভারডিউ",
  "draft": "ড্রাফট",
};

function formatCurrency(value: number) {
  if (value >= 100000) {
    return `৳${(value / 100000).toFixed(2)} লাখ`;
  }
  return `৳${value.toLocaleString('bn-BD')}`;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function FinanceInvoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("সব");
  
  const { data: invoices = [], isLoading, error } = useInvoices();
  const { data: stats } = useInvoiceStats();

  const statusFilterMap: Record<string, string> = {
    "সব": "all",
    "পেইড": "paid",
    "পেন্ডিং": "pending",
    "ওভারডিউ": "overdue",
    "ড্রাফট": "draft",
  };

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inv.client_name?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const filterStatus = statusFilterMap[statusFilter];
    const matchesStatus = filterStatus === "all" || inv.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

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
          <h1 className="text-2xl font-bold">ইনভয়েস</h1>
          <p className="text-muted-foreground">সকল বিল ও ইনভয়েস ম্যানেজ করুন</p>
        </div>
        <Button className="btn-gradient gap-2">
          <Plus className="h-4 w-4" />
          নতুন ইনভয়েস
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">মোট ইনভয়েস</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(stats?.total || 0)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">পেইড</p>
          <p className="text-2xl font-bold mt-1 text-success">{formatCurrency(stats?.paid || 0)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">পেন্ডিং</p>
          <p className="text-2xl font-bold mt-1 text-warning">{formatCurrency(stats?.pending || 0)}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">ওভারডিউ</p>
          <p className="text-2xl font-bold mt-1 text-destructive">{formatCurrency(stats?.overdue || 0)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ইনভয়েস খুঁজুন..."
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
          {["সব", "পেইড", "পেন্ডিং", "ওভারডিউ", "ড্রাফট"].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredInvoices.length === 0 && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="text-muted-foreground mb-2">কোনো ইনভয়েস পাওয়া যায়নি</p>
          <Button className="btn-gradient gap-2">
            <Plus className="h-4 w-4" />
            প্রথম ইনভয়েস তৈরি করুন
          </Button>
        </div>
      )}

      {/* Table */}
      {!isLoading && filteredInvoices.length > 0 && (
        <div className="table-container overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium">ইনভয়েস নং</th>
                <th className="text-left p-4 font-medium">ক্লায়েন্ট</th>
                <th className="text-left p-4 font-medium">প্রজেক্ট</th>
                <th className="text-left p-4 font-medium">পরিমাণ</th>
                <th className="text-left p-4 font-medium">তারিখ</th>
                <th className="text-left p-4 font-medium">শেষ তারিখ</th>
                <th className="text-left p-4 font-medium">স্ট্যাটাস</th>
                <th className="text-right p-4 font-medium">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  <td className="p-4">
                    <span className="font-mono font-medium text-primary">
                      {invoice.invoice_number}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{invoice.client_name || '-'}</td>
                  <td className="p-4 text-muted-foreground">{invoice.project_name || '-'}</td>
                  <td className="p-4 font-semibold">৳{invoice.total_amount.toLocaleString('bn-BD')}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(invoice.issue_date)}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(invoice.due_date)}</td>
                  <td className="p-4">
                    <Badge
                      variant="outline"
                      className={cn("text-xs", statusColors[invoice.status || 'draft'])}
                    >
                      {statusLabels[invoice.status || 'draft']}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && filteredInvoices.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            মোট {filteredInvoices.length}টি ইনভয়েস দেখানো হচ্ছে
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              পূর্ববর্তী
            </Button>
            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
              ১
            </Button>
            <Button variant="outline" size="sm">
              পরবর্তী
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
