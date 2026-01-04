import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Loader2, FileDown } from "lucide-react";
import { useAccounting } from "@/hooks/useAccounting";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
};

const FinanceProfitLoss = () => {
  const { data: entries, isLoading } = useAccounting();

  const totalIncome = entries?.filter(e => e.entry_type === 'income').reduce((sum, e) => sum + e.credit, 0) || 0;
  const totalExpense = entries?.filter(e => e.entry_type === 'expense').reduce((sum, e) => sum + e.debit, 0) || 0;
  const netProfitLoss = totalIncome - totalExpense;
  const profitMargin = totalIncome > 0 ? ((netProfitLoss / totalIncome) * 100).toFixed(1) : 0;

  const incomeEntries = entries?.filter(e => e.entry_type === 'income') || [];
  const expenseEntries = entries?.filter(e => e.entry_type === 'expense') || [];

  // Group by account name
  const incomeByAccount = incomeEntries.reduce((acc, e) => {
    acc[e.account_name] = (acc[e.account_name] || 0) + e.credit;
    return acc;
  }, {} as Record<string, number>);

  const expenseByAccount = expenseEntries.reduce((acc, e) => {
    acc[e.account_name] = (acc[e.account_name] || 0) + e.debit;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">লাভ-ক্ষতি রিপোর্ট</h1>
          <p className="text-muted-foreground">আর্থিক পারফরম্যান্স বিশ্লেষণ</p>
        </div>
        <Button variant="outline">
          <FileDown className="h-4 w-4 mr-2" />
          রিপোর্ট ডাউনলোড
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট আয়</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট ব্যয়</p>
                <p className="text-xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${netProfitLoss >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <DollarSign className={`h-6 w-6 ${netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">নেট {netProfitLoss >= 0 ? 'লাভ' : 'ক্ষতি'}</p>
                <p className={`text-xl font-bold ${netProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(Math.abs(netProfitLoss))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${Number(profitMargin) >= 0 ? 'bg-blue-100' : 'bg-orange-100'}`}>
                <TrendingUp className={`h-6 w-6 ${Number(profitMargin) >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">লাভের হার</p>
                <p className="text-xl font-bold">{profitMargin}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              আয়ের উৎস
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(incomeByAccount).map(([account, amount]) => (
                <div key={account} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">{account}</span>
                  <span className="text-green-600 font-bold">{formatCurrency(amount)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg font-bold">
                <span>মোট আয়</span>
                <span className="text-green-700">{formatCurrency(totalIncome)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-600" />
              ব্যয়ের খাত
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(expenseByAccount).map(([account, amount]) => (
                <div key={account} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">{account}</span>
                  <span className="text-red-600 font-bold">{formatCurrency(amount)}</span>
                </div>
              ))}
              <div className="flex justify-between items-center p-3 bg-red-100 rounded-lg font-bold">
                <span>মোট ব্যয়</span>
                <span className="text-red-700">{formatCurrency(totalExpense)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={netProfitLoss >= 0 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
        <CardContent className="pt-6">
          <div className="text-center">
            <Badge className={`text-lg px-4 py-2 ${netProfitLoss >= 0 ? 'bg-green-600' : 'bg-red-600'}`}>
              {netProfitLoss >= 0 ? 'লাভ' : 'ক্ষতি'}
            </Badge>
            <p className={`text-4xl font-bold mt-4 ${netProfitLoss >= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {formatCurrency(Math.abs(netProfitLoss))}
            </p>
            <p className="text-muted-foreground mt-2">
              এই সময়কালে আপনার ব্যবসায় {netProfitLoss >= 0 ? 'লাভ হয়েছে' : 'ক্ষতি হয়েছে'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceProfitLoss;
