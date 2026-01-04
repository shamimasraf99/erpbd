import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, TrendingUp, Loader2 } from "lucide-react";
import { useDeals } from "@/hooks/useDeals";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const stageColors: Record<string, string> = {
  qualified: "bg-blue-100 text-blue-800",
  proposal: "bg-purple-100 text-purple-800",
  negotiation: "bg-yellow-100 text-yellow-800",
  closed_won: "bg-green-100 text-green-800",
  closed_lost: "bg-red-100 text-red-800",
};

const stageLabels: Record<string, string> = {
  qualified: "যোগ্য",
  proposal: "প্রস্তাব",
  negotiation: "আলোচনা",
  closed_won: "জয়ী",
  closed_lost: "হারানো",
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('bn-BD', { style: 'currency', currency: 'BDT' }).format(amount);
};

const CRMDeals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: deals, isLoading } = useDeals();

  const filteredDeals = deals?.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = deals?.reduce((sum, d) => sum + d.amount, 0) || 0;
  const wonValue = deals?.filter(d => d.stage === 'closed_won').reduce((sum, d) => sum + d.amount, 0) || 0;
  const pipelineValue = deals?.filter(d => !['closed_won', 'closed_lost'].includes(d.stage)).reduce((sum, d) => sum + d.amount, 0) || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">ডিল ম্যানেজমেন্ট</h1>
          <p className="text-muted-foreground">বিক্রয় সুযোগ ও চুক্তি ট্র্যাকিং</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          নতুন ডিল
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">পাইপলাইন মূল্য</p>
                <p className="text-xl font-bold">{formatCurrency(pipelineValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">জয়ী মূল্য</p>
                <p className="text-xl font-bold">{formatCurrency(wonValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">মোট মূল্য</p>
                <p className="text-xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="ডিল খুঁজুন..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeals?.map((deal) => (
            <Card key={deal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{deal.title}</CardTitle>
                  <Badge className={stageColors[deal.stage]}>
                    {stageLabels[deal.stage]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">ক্লায়েন্ট</p>
                  <p className="font-medium">{deal.client?.name || 'N/A'}</p>
                  <p className="text-sm text-muted-foreground">{deal.client?.company}</p>
                </div>
                
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">মূল্য</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(deal.amount)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">সম্ভাবনা</p>
                    <p className="text-lg font-semibold">{deal.probability}%</p>
                  </div>
                </div>

                <Progress value={deal.probability} className="h-2" />

                {deal.notes && (
                  <p className="text-sm text-muted-foreground">{deal.notes}</p>
                )}

                <div className="flex justify-between items-center pt-2 border-t text-xs text-muted-foreground">
                  <span>দায়িত্বশীল: {deal.assignee?.full_name || 'N/A'}</span>
                  {deal.expected_close_date && (
                    <span>শেষ: {format(new Date(deal.expected_close_date), 'dd MMM', { locale: bn })}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CRMDeals;
