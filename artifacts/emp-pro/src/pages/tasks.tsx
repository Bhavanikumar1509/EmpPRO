import React, { useState, useRef, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useListTasks,
  useCreateTask,
  useListProjects,
  useListEmployees,
  getListTasksQueryKey,
} from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckSquare, Clock, Plus, Filter, X, ChevronDown, Users } from "lucide-react";

type Employee = { id: number; full_name: string; avatar_url?: string | null };

function AssigneeMultiSelect({
  employees,
  selected,
  onChange,
  placeholder = "Select assignees...",
}: {
  employees: Employee[];
  selected: number[];
  onChange: (ids: number[]) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const filtered = employees.filter((e) =>
    e.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (id: number) => {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  };

  const selectedEmployees = employees.filter((e) => selected.includes(e.id));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 border rounded-md px-3 py-2 text-sm bg-background hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring min-h-[38px]"
      >
        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0">
          {selectedEmployees.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : selectedEmployees.length <= 3 ? (
            selectedEmployees.map((e) => (
              <span
                key={e.id}
                className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-medium"
              >
                <Avatar className="w-4 h-4">
                  <AvatarImage src={e.avatar_url || ""} />
                  <AvatarFallback className="text-[8px]">{e.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                {e.full_name.split(" ")[0]}
                <button
                  type="button"
                  onClick={(ev) => { ev.stopPropagation(); toggle(e.id); }}
                  className="hover:text-destructive ml-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))
          ) : (
            <span className="inline-flex items-center gap-1 bg-primary/10 text-primary rounded px-1.5 py-0.5 text-xs font-medium">
              <Users className="w-3 h-3" />
              {selectedEmployees.length} assignees
            </span>
          )}
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
          <div className="p-2 border-b">
            <Input
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-7 text-xs"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto py-1">
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="w-full text-left px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted flex items-center gap-2"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
            {filtered.length === 0 ? (
              <p className="text-xs text-muted-foreground px-3 py-2">No employees found</p>
            ) : (
              filtered.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => toggle(e.id)}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted text-left"
                >
                  <Checkbox
                    checked={selected.includes(e.id)}
                    className="pointer-events-none"
                  />
                  <Avatar className="w-5 h-5">
                    <AvatarImage src={e.avatar_url || ""} />
                    <AvatarFallback className="text-[9px]">{e.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{e.full_name}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function AssigneeAvatarStack({ assignees }: { assignees: { id: number; full_name: string; avatar_url?: string | null }[] }) {
  const show = assignees.slice(0, 3);
  const extra = assignees.length - show.length;
  return (
    <div className="flex -space-x-1.5">
      {show.map((a) => (
        <Avatar key={a.id} className="w-6 h-6 border-2 border-background bg-muted ring-1 ring-border" title={a.full_name}>
          <AvatarImage src={a.avatar_url || ""} />
          <AvatarFallback className="text-[9px]">{a.full_name.charAt(0)}</AvatarFallback>
        </Avatar>
      ))}
      {extra > 0 && (
        <div className="w-6 h-6 rounded-full bg-muted border-2 border-background ring-1 ring-border flex items-center justify-center text-[9px] font-medium text-muted-foreground">
          +{extra}
        </div>
      )}
    </div>
  );
}

function NewTaskDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const queryClient = useQueryClient();
  const { data: projects } = useListProjects();
  const { data: employeesData } = useListEmployees();
  const createTask = useCreateTask({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTasksQueryKey() });
        onClose();
      },
    },
  });

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "todo" as const,
    priority: "medium" as const,
    project_id: "",
    assignee_ids: [] as number[],
    due_date: "",
    estimated_hours: "",
  });

  const set = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.project_id) return;
    createTask.mutate({
      data: {
        title: form.title,
        description: form.description || null,
        status: form.status,
        priority: form.priority as "low" | "medium" | "high" | "critical",
        project_id: Number(form.project_id),
        assignee_ids: form.assignee_ids.length > 0 ? form.assignee_ids : null,
        due_date: form.due_date || null,
        estimated_hours: form.estimated_hours ? Number(form.estimated_hours) : null,
      } as any,
    });
  };

  const employees: Employee[] = (employeesData?.employees ?? []).map((e: any) => ({
    id: e.id,
    full_name: e.full_name,
    avatar_url: e.avatar_url,
  }));

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="task-title">Title *</Label>
            <Input
              id="task-title"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Task title"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Optional details"
              rows={2}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Project *</Label>
            <Select value={form.project_id} onValueChange={(v) => set("project_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select project..." />
              </SelectTrigger>
              <SelectContent>
                {projects?.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => set("priority", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => set("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Assignees</Label>
            <AssigneeMultiSelect
              employees={employees}
              selected={form.assignee_ids}
              onChange={(ids) => set("assignee_ids", ids)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="task-due">Due Date</Label>
              <Input
                id="task-due"
                type="date"
                value={form.due_date}
                onChange={(e) => set("due_date", e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="task-hours">Est. Hours</Label>
              <Input
                id="task-hours"
                type="number"
                min="1"
                value={form.estimated_hours}
                onChange={(e) => set("estimated_hours", e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTask.isPending || !form.project_id}>
              {createTask.isPending ? "Creating…" : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type FilterState = {
  project_id: string;
  status: string;
  assignee_ids: number[];
};

function FilterPopover({
  filters,
  onChange,
}: {
  filters: FilterState;
  onChange: (f: FilterState) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data: projects } = useListProjects();
  const { data: employeesData } = useListEmployees();

  const employees: Employee[] = (employeesData?.employees ?? []).map((e: any) => ({
    id: e.id,
    full_name: e.full_name,
    avatar_url: e.avatar_url,
  }));

  const activeCount = [
    filters.project_id !== "",
    filters.status !== "",
    filters.assignee_ids.length > 0,
  ].filter(Boolean).length;

  const clear = () => onChange({ project_id: "", status: "", assignee_ids: [] });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className={activeCount > 0 ? "border-primary text-primary" : ""}>
          <Filter className="mr-2 h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <span className="ml-1.5 bg-primary text-primary-foreground rounded-full w-4 h-4 text-[10px] flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 space-y-4 p-4" align="end">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Filters</span>
          {activeCount > 0 && (
            <button
              onClick={clear}
              className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground"
            >
              <X className="h-3 w-3" /> Clear all
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Project</Label>
          <Select
            value={filters.project_id}
            onValueChange={(v) => onChange({ ...filters, project_id: v === "_all" ? "" : v })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All projects</SelectItem>
              {projects?.map((p) => (
                <SelectItem key={p.id} value={String(p.id)}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Status</Label>
          <Select
            value={filters.status}
            onValueChange={(v) => onChange({ ...filters, status: v === "_all" ? "" : v })}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="review">Review</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Assignees</Label>
          <AssigneeMultiSelect
            employees={employees}
            selected={filters.assignee_ids}
            onChange={(ids) => onChange({ ...filters, assignee_ids: ids })}
            placeholder="All assignees"
          />
          {filters.assignee_ids.length > 0 && (
            <p className="text-[10px] text-muted-foreground">
              Showing tasks assigned to {filters.assignee_ids.length === 1 ? "1 person" : `${filters.assignee_ids.length} people`}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default function Tasks() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    project_id: "",
    status: "",
    assignee_ids: [],
  });

  const { data: allTasks, isLoading } = useListTasks({
    project_id: filters.project_id ? Number(filters.project_id) : undefined,
    status: filters.status || undefined,
  });

  const tasks = allTasks?.filter((task) => {
    if (filters.assignee_ids.length === 0) return true;
    const taskAssignees: number[] = ((task as any).assignees ?? []).map((a: any) => a.id);
    return filters.assignee_ids.some((id) => taskAssignees.includes(id));
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "done": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "in_progress": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "review": return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      case "cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const getPriorityBadge = (priority: string = "medium") => {
    switch (priority) {
      case "critical": return <Badge variant="destructive">Critical</Badge>;
      case "high": return <Badge className="bg-orange-500 hover:bg-orange-600 text-white">High</Badge>;
      case "low": return <Badge variant="secondary">Low</Badge>;
      default: return <Badge variant="outline">Medium</Badge>;
    }
  };

  const columns = filters.status
    ? [filters.status]
    : ["todo", "in_progress", "done"];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
          <p className="text-muted-foreground">Manage your assigned work and team tasks.</p>
        </div>
        <div className="flex gap-2">
          <FilterPopover filters={filters} onChange={setFilters} />
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Task
          </Button>
        </div>
      </div>

      <NewTaskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((status) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-semibold capitalize flex items-center gap-2">
                {status === "todo" && <CheckSquare className="w-4 h-4 text-muted-foreground" />}
                {status === "in_progress" && <Clock className="w-4 h-4 text-blue-500" />}
                {status === "done" && <CheckSquare className="w-4 h-4 text-green-500" />}
                {status === "review" && <CheckSquare className="w-4 h-4 text-purple-500" />}
                {status.replace("_", " ")}
              </h3>
              <Badge variant="secondary">
                {tasks?.filter((t) => t.status === status).length || 0}
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
                {tasks
                  ?.filter((t) => t.status === status)
                  .map((task) => {
                    const assignees = (task as any).assignees ?? [];
                    return (
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
                              {task.due_date
                                ? new Date(task.due_date).toLocaleDateString()
                                : "No due date"}
                            </div>
                            {assignees.length > 0 ? (
                              <AssigneeAvatarStack assignees={assignees} />
                            ) : (
                              <Avatar className="w-6 h-6 border bg-muted">
                                <AvatarFallback className="text-[10px]">?</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                {tasks?.filter((t) => t.status === status).length === 0 && (
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
