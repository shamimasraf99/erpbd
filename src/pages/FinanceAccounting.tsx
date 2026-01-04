import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, BookOpen, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";
import { useAccounting } from "@/hooks/useAccounting";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const typeColors: Record<string, string> = {
  income: "bg-green-100 text-green-800",
  expense: "bg-red-100 text-red-800",
};

const typeLabels: Record<string, string> = {
  income: "আয়",
  expense: "ব্যয়",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
};

const FinanceAccounting = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: entries, isLoading } = useAccounting();

  const filteredEntries = entries?.filter(e => 
    e.account_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDebit = entries?.reduce((sum, e) => sum + e.debit, 0) || 0;
  const totalCredit = entries?.reduce((sum, e) => sum + e.credit, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">অ্যাকাউন্টিং</h1>
          <p className="text-muted-foreground">জার্নাল এন্ট্রি ও হিসাব ব্যবস্থাপনা</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          নতুন এন্ট্রি
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <ArrowUpRight className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট ডেবিট</p>
                <p className="text-xl font-bold">{formatCurrency(totalDebit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <ArrowDownLeft className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট ক্রেডিট</p>
                <p className="text-xl font-bold">{formatCurrency(totalCredit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ব্যালেন্স</p>
                <p className="text-xl font-bold">{formatCurrency(totalCredit - totalDebit)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>জার্নাল এন্ট্রি</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="এন্ট্রি খুঁজুন..."
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
                  <TableHead>তারিখ</TableHead>
                  <TableHead>ধরন</TableHead>
                  <TableHead>অ্যাকাউন্ট</TableHead>
                  <TableHead>বিবরণ</TableHead>
                  <TableHead>রেফারেন্স</TableHead>
                  <TableHead className="text-right">ডেবিট</TableHead>
                  <TableHead className="text-right">ক্রেডিট</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{format(new Date(entry.entry_date), 'dd MMM yyyy', { locale: bn })}</TableCell>
                    <TableCell>
                      <Badge className={typeColors[entry.entry_type]}>
                        {typeLabels[entry.entry_type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{entry.account_name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{entry.description}</TableCell>
                    <TableCell>{entry.reference_type || '-'}</TableCell>
                    <TableCell className="text-right text-red-600">
                      {entry.debit > 0 ? formatCurrency(entry.debit) : '-'}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {entry.credit > 0 ? formatCurrency(entry.credit) : '-'}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell colSpan={5}>মোট</TableCell>
                  <TableCell className="text-right text-red-600">{formatCurrency(totalDebit)}</TableCell>
                  <TableCell className="text-right text-green-600">{formatCurrency(totalCredit)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceAccounting;
