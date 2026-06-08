import React, { useState } from "react";
import { Link } from "wouter";
import { useListEmployees } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Plus, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Employees() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useListEmployees({ search: search || undefined });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Employees</h2>
          <p className="text-muted-foreground">Manage your organization's workforce.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
                <div className="col-span-5 sm:col-span-4">Employee</div>
                <div className="hidden sm:block col-span-3">Department</div>
                <div className="hidden md:block col-span-2">Role</div>
                <div className="col-span-4 sm:col-span-2">Status</div>
                <div className="col-span-3 sm:col-span-1 text-right">Actions</div>
              </div>
              <div className="divide-y">
                {data?.items?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No employees found.</div>
                ) : (
                  data?.items?.map((employee) => (
                    <div key={employee.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
                      <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={employee.avatar_url || ""} />
                          <AvatarFallback>{employee.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link href={`/employees/${employee.id}`} className="font-medium hover:underline text-primary">
                            {employee.full_name}
                          </Link>
                          <div className="text-xs text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                      <div className="hidden sm:flex flex-col col-span-3">
                        <span className="text-sm">{employee.department_name || "—"}</span>
                        <span className="text-xs text-muted-foreground">{employee.job_title || "—"}</span>
                      </div>
                      <div className="hidden md:block col-span-2 text-sm capitalize">
                        {employee.role}
                      </div>
                      <div className="col-span-4 sm:col-span-2">
                        <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                          {employee.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="col-span-3 sm:col-span-1 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/employees/${employee.id}`}>View Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit Details</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
