import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListAttendance,
  useCreateAttendance,
  useCheckOut,
  getListAttendanceQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, Clock, LogIn, LogOut } from "lucide-react";

export default function Attendance() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: attendance, isLoading } = useListAttendance();

  const checkIn = useCreateAttendance({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAttendanceQueryKey() });
      },
    },
  });

  const checkOut = useCheckOut({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListAttendanceQueryKey() });
      },
    },
  });

  const todayStr = new Date().toISOString().slice(0, 10);

  const todayRecord = attendance?.find((r) => {
    const recordDate = new Date(r.date).toISOString().slice(0, 10);
    return recordDate === todayStr && r.employee_id === user?.id;
  });

  const hasCheckedIn = !!todayRecord;
  const hasCheckedOut = !!todayRecord?.check_out;

  const handleCheckIn = () => {
    if (!user) return;
    const now = new Date();
    checkIn.mutate({
      data: {
        employee_id: user.id,
        date: todayStr,
        check_in: now.toISOString(),
      },
    });
  };

  const handleCheckOut = () => {
    if (!todayRecord) return;
    checkOut.mutate({ id: todayRecord.id });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "absent":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "late":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "half_day":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "on_leave":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">Track daily check-ins and hours.</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-green-500/30 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
            onClick={handleCheckIn}
            disabled={hasCheckedIn || checkIn.isPending}
          >
            <LogIn className="mr-2 h-4 w-4" />
            {checkIn.isPending ? "Checking in…" : hasCheckedIn ? "Checked In" : "Check In"}
          </Button>
          <Button
            variant="outline"
            className="border-red-500/30 text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
            onClick={handleCheckOut}
            disabled={!hasCheckedIn || hasCheckedOut || checkOut.isPending}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {checkOut.isPending ? "Checking out…" : hasCheckedOut ? "Checked Out" : "Check Out"}
          </Button>
        </div>
      </div>

      {hasCheckedIn && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/40 border rounded-lg px-4 py-2 w-fit">
          <CalendarCheck className="w-4 h-4 text-green-500" />
          Today: checked in at{" "}
          {new Date(todayRecord!.check_in!).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {hasCheckedOut && (
            <>
              {" "}· checked out at{" "}
              {new Date(todayRecord!.check_out!).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Attendance Log</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="rounded-md border divide-y">
              {attendance?.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No attendance records found.
                </div>
              ) : (
                attendance?.map((record) => (
                  <div
                    key={record.id}
                    className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30"
                  >
                    <div className="col-span-12 sm:col-span-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {new Date(record.date).getDate()}
                        </span>
                        <span className="text-[10px] text-primary/80 uppercase leading-none">
                          {new Date(record.date).toLocaleString("default", { month: "short" })}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{record.employee_name}</div>
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <div className="text-xs text-muted-foreground mb-1">Check In</div>
                      <div className="font-mono text-sm">
                        {record.check_in
                          ? new Date(record.check_in).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </div>
                    </div>
                    <div className="col-span-6 sm:col-span-3">
                      <div className="text-xs text-muted-foreground mb-1">Check Out</div>
                      <div className="font-mono text-sm">
                        {record.check_out
                          ? new Date(record.check_out).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-3 flex justify-between sm:justify-end items-center gap-4">
                      {record.work_hours && (
                        <div className="text-sm font-mono text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {record.work_hours}h
                        </div>
                      )}
                      <Badge className={getStatusColor(record.status)} variant="outline">
                        {record.status.replace("_", " ")}
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
