import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, DollarSign, CheckCircle, Clock, Loader2 } from "lucide-react";
import { usePayroll } from "@/hooks/usePayroll";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const statusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
};

const statusLabels: Record<string, string> = {
  paid: "পরিশোধিত",
  pending: "অপেক্ষমান",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
};

const HRMPayroll = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: payrolls, isLoading } = usePayroll();

  const filteredPayrolls = payrolls?.filter(p => 
    p.employee?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPaid = payrolls?.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.net_salary, 0) || 0;
  const totalPending = payrolls?.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.net_salary, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">বেতন (Payroll)</h1>
          <p className="text-muted-foreground">কর্মচারীদের বেতন ব্যবস্থাপনা</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          নতুন বেতন যোগ করুন
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">পরিশোধিত</p>
                <p className="text-xl font-bold">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">অপেক্ষমান</p>
                <p className="text-xl font-bold">{formatCurrency(totalPending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট বেতন</p>
                <p className="text-xl font-bold">{formatCurrency(totalPaid + totalPending)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>বেতন তালিকা</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="কর্মচারী খুঁজুন..."
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
                  <TableHead>মাস</TableHead>
                  <TableHead>মূল বেতন</TableHead>
                  <TableHead>ভাতা</TableHead>
                  <TableHead>কর্তন</TableHead>
                  <TableHead>বোনাস</TableHead>
                  <TableHead>নেট বেতন</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayrolls?.map((payroll) => (
                  <TableRow key={payroll.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payroll.employee?.full_name}</p>
                        <p className="text-sm text-muted-foreground">{payroll.employee?.designation}</p>
                      </div>
                    </TableCell>
                    <TableCell>{format(new Date(payroll.month), 'MMMM yyyy', { locale: bn })}</TableCell>
                    <TableCell>{formatCurrency(payroll.basic_salary)}</TableCell>
                    <TableCell className="text-green-600">+{formatCurrency(payroll.allowances)}</TableCell>
                    <TableCell className="text-red-600">-{formatCurrency(payroll.deductions)}</TableCell>
                    <TableCell className="text-blue-600">+{formatCurrency(payroll.bonus)}</TableCell>
                    <TableCell className="font-bold">{formatCurrency(payroll.net_salary)}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[payroll.status]}>
                        {statusLabels[payroll.status]}
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

export default HRMPayroll;
