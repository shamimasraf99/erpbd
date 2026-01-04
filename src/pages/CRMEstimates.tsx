import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, FileText, Loader2 } from "lucide-react";
import { useEstimates } from "@/hooks/useEstimates";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  sent: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  expired: "bg-yellow-100 text-yellow-800",
};

const statusLabels: Record<string, string> = {
  draft: "খসড়া",
  sent: "পাঠানো",
  accepted: "গৃহীত",
  rejected: "প্রত্যাখ্যাত",
  expired: "মেয়াদোত্তীর্ণ",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
};

const CRMEstimates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: estimates, isLoading } = useEstimates();

  const filteredEstimates = estimates?.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.estimate_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">এস্টিমেট</h1>
          <p className="text-muted-foreground">মূল্য প্রস্তাব ও কোটেশন</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          নতুন এস্টিমেট
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>এস্টিমেট তালিকা</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="এস্টিমেট খুঁজুন..."
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
                  <TableHead>এস্টিমেট নং</TableHead>
                  <TableHead>শিরোনাম</TableHead>
                  <TableHead>ক্লায়েন্ট</TableHead>
                  <TableHead>সাবটোটাল</TableHead>
                  <TableHead>ট্যাক্স</TableHead>
                  <TableHead>ছাড়</TableHead>
                  <TableHead>মোট</TableHead>
                  <TableHead>মেয়াদ</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEstimates?.map((estimate) => (
                  <TableRow key={estimate.id}>
                    <TableCell className="font-mono">{estimate.estimate_number}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        {estimate.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{estimate.client?.name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{estimate.client?.company}</p>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(estimate.subtotal)}</TableCell>
                    <TableCell>{formatCurrency(estimate.tax)}</TableCell>
                    <TableCell className="text-red-600">-{formatCurrency(estimate.discount)}</TableCell>
                    <TableCell className="font-bold">{formatCurrency(estimate.total)}</TableCell>
                    <TableCell>
                      {estimate.valid_until ? format(new Date(estimate.valid_until), 'dd MMM yyyy', { locale: bn }) : '-'}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[estimate.status]}>
                        {statusLabels[estimate.status]}
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

export default CRMEstimates;
