import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Download, Send, Eye, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Invoice {
  id: string;
  client: string;
  project: string;
  amount: string;
  date: string;
  dueDate: string;
  status: "পেইড" | "পেন্ডিং" | "ওভারডিউ" | "ড্রাফট";
}

const invoices: Invoice[] = [
  { id: "INV-2025-001", client: "টেক সলিউশন্স", project: "ই-কমার্স ওয়েবসাইট", amount: "৳১,৫০,০০০", date: "০১ জানু ২০২৫", dueDate: "১৫ জানু ২০২৫", status: "পেন্ডিং" },
  { id: "INV-2025-002", client: "গ্রিন এনার্জি", project: "মোবাইল অ্যাপ", amount: "৳২,২৫,০০০", date: "২৮ ডিসে ২০২৪", dueDate: "১২ জানু ২০২৫", status: "পেইড" },
  { id: "INV-2024-098", client: "ব্লু স্কাই কর্প", project: "ERP সিস্টেম", amount: "৳৩,৫০,০০০", date: "১৫ ডিসে ২০২৪", dueDate: "৩০ ডিসে ২০২৪", status: "ওভারডিউ" },
  { id: "INV-2025-003", client: "ডিজিটাল ফার্স্ট", project: "ক্লাউড মাইগ্রেশন", amount: "৳৮৫,০০০", date: "০৫ জানু ২০২৫", dueDate: "২০ জানু ২০২৫", status: "ড্রাফট" },
  { id: "INV-2024-097", client: "ফাইন্যান্স প্রো", project: "ডাটা অ্যানালিটিক্স", amount: "৳১,৮০,০০০", date: "১০ ডিসে ২০২৪", dueDate: "২৫ ডিসে ২০২৪", status: "পেইড" },
  { id: "INV-2024-096", client: "স্মার্ট হোম", project: "IoT ইন্টিগ্রেশন", amount: "৳৯৫,০০০", date: "০১ ডিসে ২০২৪", dueDate: "১৫ ডিসে ২০২৪", status: "পেইড" },
];

const statusColors = {
  "পেইড": "bg-success/10 text-success border-success/30",
  "পেন্ডিং": "bg-warning/10 text-warning border-warning/30",
  "ওভারডিউ": "bg-destructive/10 text-destructive border-destructive/30",
  "ড্রাফট": "bg-muted text-muted-foreground border-border",
};

export default function FinanceInvoices() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("সব");

  const stats = {
    total: "৳১০,৮৫,০০০",
    paid: "৳৬,০০,০০০",
    pending: "৳১,৫০,০০০",
    overdue: "৳৩,৫০,০০০",
  };

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
          <p className="text-2xl font-bold mt-1">{stats.total}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">পেইড</p>
          <p className="text-2xl font-bold mt-1 text-success">{stats.paid}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">পেন্ডিং</p>
          <p className="text-2xl font-bold mt-1 text-warning">{stats.pending}</p>
        </div>
        <div className="stat-card">
          <p className="text-sm text-muted-foreground">ওভারডিউ</p>
          <p className="text-2xl font-bold mt-1 text-destructive">{stats.overdue}</p>
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

      {/* Table */}
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
            {invoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-border hover:bg-muted/30 transition-colors"
              >
                <td className="p-4">
                  <span className="font-mono font-medium text-primary">
                    {invoice.id}
                  </span>
                </td>
                <td className="p-4 font-medium">{invoice.client}</td>
                <td className="p-4 text-muted-foreground">{invoice.project}</td>
                <td className="p-4 font-semibold">{invoice.amount}</td>
                <td className="p-4 text-muted-foreground">{invoice.date}</td>
                <td className="p-4 text-muted-foreground">{invoice.dueDate}</td>
                <td className="p-4">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", statusColors[invoice.status])}
                  >
                    {invoice.status}
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

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          মোট {invoices.length}টি ইনভয়েস দেখানো হচ্ছে
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            পূর্ববর্তী
          </Button>
          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
            ১
          </Button>
          <Button variant="outline" size="sm">
            ২
          </Button>
          <Button variant="outline" size="sm">
            পরবর্তী
          </Button>
        </div>
      </div>
    </div>
  );
}
