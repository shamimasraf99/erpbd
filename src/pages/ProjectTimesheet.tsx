import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Clock, Loader2 } from "lucide-react";
import { useTimesheets } from "@/hooks/useTimesheets";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const statusColors: Record<string, string> = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  approved: "অনুমোদিত",
  pending: "অপেক্ষমান",
  rejected: "প্রত্যাখ্যাত",
};

const ProjectTimesheet = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: timesheets, isLoading } = useTimesheets();

  const filteredTimesheets = timesheets?.filter(t => 
    t.employee?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.project?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalHours = timesheets?.reduce((sum, t) => sum + t.hours_worked, 0) || 0;
  const billableHours = timesheets?.filter(t => t.billable).reduce((sum, t) => sum + t.hours_worked, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">টাইমশিট</h1>
          <p className="text-muted-foreground">কাজের সময় ট্র্যাকিং</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          সময় যোগ করুন
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট ঘণ্টা</p>
                <p className="text-xl font-bold">{totalHours} ঘণ্টা</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">বিলযোগ্য ঘণ্টা</p>
                <p className="text-xl font-bold">{billableHours} ঘণ্টা</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <Clock className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">নন-বিলযোগ্য</p>
                <p className="text-xl font-bold">{totalHours - billableHours} ঘণ্টা</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>টাইমশিট এন্ট্রি</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="খুঁজুন..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>কর্মচারী</TableHead>
                  <TableHead>তারিখ</TableHead>
                  <TableHead>প্রজেক্ট</TableHead>
                  <TableHead>টাস্ক</TableHead>
                  <TableHead>ঘণ্টা</TableHead>
                  <TableHead>বিবরণ</TableHead>
                  <TableHead>বিলযোগ্য</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTimesheets?.map((timesheet) => (
                  <TableRow key={timesheet.id}>
                    <TableCell className="font-medium">{timesheet.employee?.full_name}</TableCell>
                    <TableCell>{format(new Date(timesheet.work_date), 'dd MMM yyyy', { locale: bn })}</TableCell>
                    <TableCell>{timesheet.project?.name || '-'}</TableCell>
                    <TableCell>{timesheet.task?.title || '-'}</TableCell>
                    <TableCell className="font-bold">{timesheet.hours_worked} ঘণ্টা</TableCell>
                    <TableCell className="max-w-[200px] truncate">{timesheet.description}</TableCell>
                    <TableCell>
                      <Badge className={timesheet.billable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {timesheet.billable ? 'হ্যাঁ' : 'না'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[timesheet.status]}>
                        {statusLabels[timesheet.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectTimesheet;
