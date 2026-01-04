import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Search, Star, Loader2 } from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";
import { format } from "date-fns";
import { bn } from "date-fns/locale";

const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
};

const statusLabels: Record<string, string> = {
  completed: "সম্পন্ন",
  pending: "অপেক্ষমান",
};

const HRMPerformance = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: reviews, isLoading } = usePerformance();

  const filteredReviews = reviews?.filter(r => 
    r.employee?.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">পারফরম্যান্স রিভিউ</h1>
          <p className="text-muted-foreground">কর্মচারীদের কর্মক্ষমতা মূল্যায়ন</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          নতুন রিভিউ
        </Button>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="কর্মচারী খুঁজুন..."
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
          {filteredReviews?.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{review.employee?.full_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{review.employee?.designation}</p>
                  </div>
                  <Badge className={statusColors[review.status]}>
                    {statusLabels[review.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">রিভিউ পিরিয়ড</p>
                  <p className="font-medium">{review.review_period}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">রেটিং</p>
                  <div className="flex gap-1">{renderStars(review.rating)}</div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-1">গোল অর্জন</p>
                  <p className="font-medium text-green-600">{review.goals_achieved}</p>
                </div>

                {review.strengths && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">শক্তি</p>
                    <p className="text-sm">{review.strengths}</p>
                  </div>
                )}

                {review.improvements && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">উন্নতির সুযোগ</p>
                    <p className="text-sm">{review.improvements}</p>
                  </div>
                )}

                <div className="text-xs text-muted-foreground pt-2 border-t">
                  রিভিউয়ার: {review.reviewer?.full_name || 'N/A'} | 
                  তারিখ: {format(new Date(review.review_date), 'dd MMM yyyy', { locale: bn })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default HRMPerformance;
