import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, FileText, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useContracts } from "@/hooks/useContracts";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-800",
  pending: "bg-yellow-100 text-yellow-800",
  active: "bg-green-100 text-green-800",
  expired: "bg-red-100 text-red-800",
  terminated: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  draft: "খসড়া",
  pending: "অপেক্ষমান",
  active: "সক্রিয়",
  expired: "মেয়াদোত্তীর্ণ",
  terminated: "বাতিল",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
};

const Contracts = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: contracts, isLoading } = useContracts();

  const filteredContracts = contracts?.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.contract_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = contracts?.reduce((sum, c) => sum + c.value, 0) || 0;
  const activeContracts = contracts?.filter(c => c.status === 'active').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">কনট্রাক্ট ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">চুক্তি তৈরি ও ব্যবস্থাপনা</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          নতুন কনট্রাক্ট
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট কনট্রাক্ট</p>
                <p className="text-xl font-bold">{contracts?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">সক্রিয় কনট্রাক্ট</p>
                <p className="text-xl font-bold">{activeContracts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট মূল্য</p>
                <p className="text-xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>কনট্রাক্ট তালিকা</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="কনট্রাক্ট খুঁজুন..."
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
                  <TableHead>কনট্রাক্ট নং</TableHead>
                  <TableHead>শিরোনাম</TableHead>
                  <TableHead>ক্লায়েন্ট</TableHead>
                  <TableHead>প্রজেক্ট</TableHead>
                  <TableHead>শুরু</TableHead>
                  <TableHead>শেষ</TableHead>
                  <TableHead>মূল্য</TableHead>
                  <TableHead>ক্লায়েন্ট সই</TableHead>
                  <TableHead>কোম্পানি সই</TableHead>
                  <TableHead>স্ট্যাটাস</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts?.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell className="font-mono">{contract.contract_number}</TableCell>
                    <TableCell className="font-medium">{contract.title}</TableCell>
                    <TableCell>{contract.client?.name || '-'}</TableCell>
                    <TableCell>{contract.project?.name || '-'}</TableCell>
                    <TableCell>{format(new Date(contract.start_date), 'dd MMM yyyy', { locale: bn })}</TableCell>
                    <TableCell>
                      {contract.end_date ? format(new Date(contract.end_date), 'dd MMM yyyy', { locale: bn }) : '-'}
                    </TableCell>
                    <TableCell className="font-bold">{formatCurrency(contract.value)}</TableCell>
                    <TableCell>
                      {contract.signed_by_client ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      {contract.signed_by_company ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[contract.status]}>
                        {statusLabels[contract.status]}
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

export default Contracts;
