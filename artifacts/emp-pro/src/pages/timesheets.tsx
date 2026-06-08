import React from "react";
import { useListTimesheets } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Plus } from "lucide-react";

export default function Timesheets() {
  const { data: timesheets, isLoading } = useListTimesheets();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Timesheets</h2>
          <p className="text-muted-foreground">Log hours against projects and tasks.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Log Hours
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : (
            <div className="rounded-md border divide-y">
              {timesheets?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">No timesheets found.</div>
              ) : (
                timesheets?.map(ts => (
                  <div key={ts.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30">
                    <div className="col-span-12 sm:col-span-3">
                      <div className="font-medium">{new Date(ts.date).toLocaleDateString()}</div>
                      <div className="text-xs text-muted-foreground">{ts.employee_name}</div>
                    </div>
                    <div className="col-span-12 sm:col-span-4">
                      <div className="font-medium text-sm">{ts.project_name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">{ts.task_title || ts.description}</div>
                    </div>
                    <div className="col-span-6 sm:col-span-2 font-mono flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      {ts.hours}h
                    </div>
                    <div className="col-span-6 sm:col-span-3 text-right">
                      <Badge className={getStatusColor(ts.status)} variant="outline">
                        {ts.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
