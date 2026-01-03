import { useState } from "react";
import { Plus, Search, Filter, MoreHorizontal, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Employee {
  id: number;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  joinDate: string;
  status: "সক্রিয়" | "ছুটিতে" | "নিষ্ক্রিয়";
  avatar: string;
}

const employees: Employee[] = [
  { id: 1, name: "আহমেদ করিম", designation: "সিনিয়র ডেভেলপার", department: "প্রযুক্তি", email: "ahmed@company.com", phone: "০১৭১২৩৪৫৬৭৮", joinDate: "১৫ জানু ২০২২", status: "সক্রিয়", avatar: "আ" },
  { id: 2, name: "সাবরিনা আক্তার", designation: "UI/UX ডিজাইনার", department: "ডিজাইন", email: "sabrina@company.com", phone: "০১৮১২৩৪৫৬৭৮", joinDate: "২০ মার্চ ২০২২", status: "সক্রিয়", avatar: "সা" },
  { id: 3, name: "রহিম উদ্দিন", designation: "প্রজেক্ট ম্যানেজার", department: "অপারেশন", email: "rahim@company.com", phone: "০১৯১২৩৪৫৬৭৮", joinDate: "০১ ফেব ২০২১", status: "ছুটিতে", avatar: "র" },
  { id: 4, name: "তানভীর হোসেন", designation: "জুনিয়র ডেভেলপার", department: "প্রযুক্তি", email: "tanvir@company.com", phone: "০১৬১২৩৪৫৬৭৮", joinDate: "১০ জুন ২০২৩", status: "সক্রিয়", avatar: "ত" },
  { id: 5, name: "ফারহানা রহমান", designation: "HR ম্যানেজার", department: "মানব সম্পদ", email: "farhana@company.com", phone: "০১৫১২৩৪৫৬৭৮", joinDate: "০৫ এপ্রিল ২০২০", status: "সক্রিয়", avatar: "ফা" },
  { id: 6, name: "মাহমুদ হাসান", designation: "সিনিয়র QA", department: "প্রযুক্তি", email: "mahmud@company.com", phone: "০১৪১২৩৪৫৬৭৮", joinDate: "১৮ আগস্ট ২০২১", status: "নিষ্ক্রিয়", avatar: "মা" },
];

const statusColors = {
  "সক্রিয়": "bg-success/10 text-success border-success/30",
  "ছুটিতে": "bg-warning/10 text-warning border-warning/30",
  "নিষ্ক্রিয়": "bg-destructive/10 text-destructive border-destructive/30",
};

const departmentColors: Record<string, string> = {
  "প্রযুক্তি": "bg-primary/10 text-primary",
  "ডিজাইন": "bg-accent/10 text-accent",
  "অপারেশন": "bg-warning/10 text-warning",
  "মানব সম্পদ": "bg-success/10 text-success",
};

export default function HRMEmployees() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.includes(searchQuery) ||
      emp.designation.includes(searchQuery) ||
      emp.department.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">কর্মী তালিকা</h1>
          <p className="text-muted-foreground">মোট {employees.length} জন কর্মী</p>
        </div>
        <Button className="btn-gradient gap-2">
          <Plus className="h-4 w-4" />
          নতুন কর্মী যোগ করুন
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 sm:flex-none">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="কর্মী খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full sm:w-80 input-bangla"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-1" />
            ফিল্টার
          </Button>
          <select className="px-3 py-2 rounded-lg border border-input bg-background text-sm input-bangla">
            <option>সব বিভাগ</option>
            <option>প্রযুক্তি</option>
            <option>ডিজাইন</option>
            <option>অপারেশন</option>
            <option>মানব সম্পদ</option>
          </select>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="stat-card hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-semibold text-primary">
                    {employee.avatar}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold">{employee.name}</h3>
                  <p className="text-sm text-muted-foreground">{employee.designation}</p>
                  <Badge
                    variant="secondary"
                    className={cn("mt-1 text-xs", departmentColors[employee.department])}
                  >
                    {employee.department}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-2">
              <p className="text-sm flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                {employee.email}
              </p>
              <p className="text-sm flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                {employee.phone}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                যোগদান: {employee.joinDate}
              </span>
              <Badge variant="outline" className={cn("text-xs", statusColors[employee.status])}>
                {employee.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
