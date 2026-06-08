import React from "react";
import { useGetDashboardStats } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FolderKanban, CheckSquare, Clock, Activity, CalendarCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats();

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px]" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <Skeleton className="h-[300px] w-full rounded-xl" />
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Employees",
      value: stats.total_employees,
      subValue: `${stats.active_employees} active`,
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Active Projects",
      value: stats.active_projects,
      subValue: `out of ${stats.total_projects} total`,
      icon: FolderKanban,
      color: "text-purple-500",
    },
    {
      title: "Completed Tasks",
      value: stats.completed_tasks || 0,
      subValue: `out of ${stats.total_tasks} total`,
      icon: CheckSquare,
      color: "text-green-500",
    },
    {
      title: "Present Today",
      value: stats.present_today,
      subValue: `${stats.on_leave_today} on leave`,
      icon: CalendarCheck,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card key={i} className="overflow-hidden hover-elevate shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.title}
              </CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {kpi.subValue}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recent_activities && stats.recent_activities.length > 0 ? (
              <div className="space-y-4">
                {stats.recent_activities.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.created_at).toLocaleString()}
                        {activity.user_name ? ` • ${activity.user_name}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 rounded-lg border border-orange-200 dark:border-orange-900/50">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5" />
                  <span className="font-medium">Pending Timesheets</span>
                </div>
                <span className="text-lg font-bold">{stats.pending_timesheets}</span>
              </div>
              
              {/* Could add other attention items here */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
