import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Wallet, Loader2 } from "lucide-react";
import { useBudgets } from "@/hooks/useBudgets";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
};

const ProjectBudget = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: budgets, isLoading } = useBudgets();

  const filteredBudgets = budgets?.filter(b => 
    b.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.project?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAllocated = budgets?.reduce((sum, b) => sum + b.allocated_amount, 0) || 0;
  const totalSpent = budgets?.reduce((sum, b) => sum + b.spent_amount, 0) || 0;
  const remaining = totalAllocated - totalSpent;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">প্রজেক্ট বাজেট</h1>
          <p className="text-muted-foreground">প্রজেক্ট খরচ ও বাজেট ব্যবস্থাপনা</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          বাজেট যোগ করুন
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট বরাদ্দ</p>
                <p className="text-xl font-bold">{formatCurrency(totalAllocated)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Wallet className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট খরচ</p>
                <p className="text-xl font-bold">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">অবশিষ্ট</p>
                <p className="text-xl font-bold">{formatCurrency(remaining)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="বাজেট খুঁজুন..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBudgets?.map((budget) => {
            const percentSpent = (budget.spent_amount / budget.allocated_amount) * 100;
            const isOverBudget = percentSpent > 100;
            return (
              <Card key={budget.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{budget.project?.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{budget.category}</p>
                    </div>
                    <Badge className={isOverBudget ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
                      {isOverBudget ? 'বাজেট অতিক্রম' : 'বাজেটের মধ্যে'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">বরাদ্দ</p>
                      <p className="font-bold">{formatCurrency(budget.allocated_amount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">খরচ</p>
                      <p className="font-bold text-red-600">{formatCurrency(budget.spent_amount)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>ব্যবহৃত</span>
                      <span className={isOverBudget ? "text-red-600 font-medium" : ""}>
                        {percentSpent.toFixed(0)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(percentSpent, 100)} 
                      className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : ''}`} 
                    />
                  </div>

                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">অবশিষ্ট</p>
                    <p className={`font-bold ${isOverBudget ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(budget.allocated_amount - budget.spent_amount)}
                    </p>
                  </div>

                  {budget.notes && (
                    <p className="text-sm text-muted-foreground">{budget.notes}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectBudget;
