import React, { useState } from "react";
import { Link } from "wouter";
import { useListTasks } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckSquare, Clock, Plus, Filter } from "lucide-react";

export default function Tasks() {
  const { data: tasks, isLoading } = useListTasks();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'review': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getPriorityBadge = (priority: string = 'medium') => {
    switch (priority) {
      case 'critical': return <Badge variant="destructive">Critical</Badge>;
      case 'high': return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">High</Badge>;
      case 'low': return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">Medium</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage your assigned work and team tasks.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {['todo', 'in_progress', 'done'].map(status => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-semibold capitalize flex items-center gap-2">
                {status === 'todo' && <CheckSquare className="w-4 h-4 text-muted-foreground" />}
                {status === 'in_progress' && <Clock className="w-4 h-4 text-blue-500" />}
                {status === 'done' && <CheckSquare className="w-4 h-4 text-green-500" />}
                {status.replace('_', ' ')}
              </h3>
              <Badge variant="secondary">
                {tasks?.filter(t => t.status === status).length || 0}
              </Badge>
            </div>
            
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="p-4 pb-2">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex justify-between items-center mt-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                      <Skeleton className="h-6 w-6 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="space-y-3">
                {tasks?.filter(t => t.status === status).map(task => (
                  <Card key={task.id} className="hover-elevate cursor-pointer">
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        {getPriorityBadge(task.priority)}
                        <span className="text-xs text-muted-foreground">
                          {task.project_name}
                        </span>
                      </div>
                      <CardTitle className="text-base line-clamp-2 leading-snug">
                        {task.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No due date'}
                        </div>
                        <Avatar className="w-6 h-6 border bg-muted">
                          <AvatarImage src={task.assignee_avatar || ""} />
                          <AvatarFallback className="text-[10px]">{task.assignee_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {tasks?.filter(t => t.status === status).length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground border border-dashed rounded-lg bg-muted/20">
                    No tasks
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
