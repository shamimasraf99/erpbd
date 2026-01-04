import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Target, Loader2 } from "lucide-react";
import { useGoals } from "@/hooks/useGoals";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  in_progress: "bg-blue-100 text-blue-800",
  not_started: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  completed: "সম্পন্ন",
  in_progress: "চলমান",
  not_started: "শুরু হয়নি",
};

const priorityColors: Record<string, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
};

const priorityLabels: Record<string, string> = {
  high: "উচ্চ",
  medium: "মাঝারি",
  low: "নিম্ন",
};

const HRMGoals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: goals, isLoading } = useGoals();

  const filteredGoals = goals?.filter(g => 
    g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.employee?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const calculateProgress = (current: number, target: number | null) => {
    if (!target) return 0;
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">গোল ট্র্যাকিং</h1>
          <p className="text-muted-foreground">কর্মচারীদের লক্ষ্যমাত্রা ও অগ্রগতি</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          নতুন গোল
        </Button>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="গোল খুঁজুন..."
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
          {filteredGoals?.map((goal) => {
            const progress = calculateProgress(goal.current_value, goal.target_value);
            return (
              <Card key={goal.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                    </div>
                    <Badge className={priorityColors[goal.priority]}>
                      {priorityLabels[goal.priority]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">কর্মচারী</p>
                    <p className="font-medium">{goal.employee?.full_name}</p>
                  </div>
                  
                  {goal.description && (
                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>অগ্রগতি</span>
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{goal.current_value} {goal.unit}</span>
                      <span>{goal.target_value} {goal.unit}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t">
                    <Badge className={statusColors[goal.status]}>
                      {statusLabels[goal.status]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      শেষ তারিখ: {format(new Date(goal.end_date), 'dd MMM yyyy', { locale: bn })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HRMGoals;
