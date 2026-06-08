import React from "react";
import { useListPerformanceReviews } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, TrendingUp, Star } from "lucide-react";

export default function Performance() {
  const { data: reviews, isLoading } = useListPerformanceReviews();

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-500';
    if (rating >= 3.5) return 'text-blue-500';
    if (rating >= 2.5) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Reviews</h2>
          <p className="text-muted-foreground">Manage employee evaluations and goals.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Review
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-[200px]" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))
        ) : reviews?.length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
            No performance reviews found.
          </div>
        ) : (
          reviews?.map((review) => (
            <Card key={review.id} className="hover-elevate shadow-sm">
              <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                <div>
                  <CardTitle className="text-lg">{review.employee_name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Period: {review.period}</p>
                </div>
                <Badge variant={review.status === 'published' ? 'default' : 'secondary'} className="capitalize">
                  {review.status}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 mt-2 mb-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Overall</span>
                    <div className="flex items-center gap-1">
                      <Star className={`h-5 w-5 fill-current ${getRatingColor(review.overall_rating)}`} />
                      <span className="text-2xl font-bold">{review.overall_rating}</span>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-border"></div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 flex-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Productivity</span>
                      <span className="font-medium">{review.productivity_rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quality</span>
                      <span className="font-medium">{review.quality_rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Teamwork</span>
                      <span className="font-medium">{review.teamwork_rating}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Goals</span>
                      <span className="font-medium">{review.goals_achieved}/{review.goals_total}</span>
                    </div>
                  </div>
                </div>
                {review.comments && (
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md italic line-clamp-2">
                    "{review.comments}"
                  </p>
                )}
                <div className="mt-4 text-xs text-muted-foreground text-right">
                  Reviewer: {review.reviewer_name}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
