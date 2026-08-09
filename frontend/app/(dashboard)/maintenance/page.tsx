'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Wrench, Clock, CheckCircle2, AlertTriangle, Play, Pause, Plus, FileText, Sparkles, MapPin } from 'lucide-react';

export default function MaintenanceStaffPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [completedCount, setCompletedCount] = useState(12);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [noteInput, setNoteInput] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('hostelhub_token');
        const res = await fetch('/api/maintenance/tasks', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json.success && json.data?.tasks) {
          setTasks(json.data.tasks);
          setCompletedCount(json.data.completedTodayCount || 12);
          if (json.data.tasks.length > 0) setSelectedTask(json.data.tasks[0]);
        }
      } catch (err) {
        console.error('Failed to load maintenance tasks:', err);
      }
    };

    fetchTasks();
  }, []);

  // Demo fallback dataset
  const demoTasks = [
    {
      id: 'task-1',
      complaint: {
        ticketNumber: 'TKT-1042',
        title: 'Ceiling Fan grinding noise & slow rotation',
        description: 'Loud noise coming from fan inside B-204. High priority electrical issue.',
        category: 'ELECTRICAL',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        locationType: 'Room B-204 · Block B',
        isAiClassified: true,
        aiConfidence: 0.94,
        student: { user: { name: 'Rahul Sharma', phone: '+91 9876543200' } },
        updates: [
          { time: '10:15 AM', message: 'Task accepted by Suresh Electrician', isWorkNote: true },
          { time: '10:28 AM', message: 'Reached room B-204. Tested fan capacitor.', isWorkNote: true },
          { time: '10:42 AM', message: 'Replacement part required: 2.5mFD motor capacitor', isWorkNote: true },
        ],
      },
      status: 'IN_PROGRESS',
      dueTime: '10:30 AM',
      slaDeadline: 'In 45 mins',
    },
    {
      id: 'task-2',
      complaint: {
        ticketNumber: 'TKT-1045',
        title: 'Study desk lock jammed',
        description: 'Key is stuck inside drawer lock in Room C-102.',
        category: 'FURNITURE',
        priority: 'MEDIUM',
        status: 'ASSIGNED',
        locationType: 'Room C-102 · Block C',
        isAiClassified: true,
        aiConfidence: 0.89,
        student: { user: { name: 'Farhan Khan', phone: '+91 9876543015' } },
        updates: [
          { time: '09:00 AM', message: 'Ticket assigned to Carpentry Team', isWorkNote: false },
        ],
      },
      status: 'ASSIGNED',
      dueTime: '02:00 PM',
      slaDeadline: 'In 3 hours',
    },
  ];

  const tasksList = tasks.length > 0 ? tasks : demoTasks;
  const activeTask = selectedTask || tasksList[0];

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('hostelhub_token');
      await fetch(`/api/maintenance/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus, workNote: noteInput || undefined }),
      });

      setNoteInput('');
      // Update local state
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
      );
      if (selectedTask?.id === taskId) {
        setSelectedTask((prev: any) => ({ ...prev, status: newStatus }));
      }
    } catch (e) {
      console.error('Failed to update task:', e);
    }
  };

  return (
    <AppShell role="MAINTENANCE" userName="Suresh Electrician" roomDetails="Electrical Maintenance Team">
      <div className="space-y-6">
        {/* Header Stats Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-6 rounded-xl shadow-xs">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Maintenance Task Queue</h1>
            <p className="text-xs text-muted-foreground">Task-focused technician workbench & SLA countdown</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-center px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{completedCount}</div>
              <div className="text-[10px] font-medium text-emerald-700 dark:text-emerald-300 uppercase">Completed Today</div>
            </div>
            <div className="text-center px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{tasksList.length}</div>
              <div className="text-[10px] font-medium text-amber-700 dark:text-amber-300 uppercase">Pending Tasks</div>
            </div>
          </div>
        </div>

        {/* Task List & Detail Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Column */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">My Tasks</h3>
            {tasksList.map((t) => {
              const comp = t.complaint || t;
              return (
                <Card
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className={`p-4 border transition-all cursor-pointer ${
                    activeTask?.id === t.id ? 'border-primary ring-1 ring-primary/30 bg-primary/5' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-muted-foreground">{comp.ticketNumber}</span>
                    <Badge variant={comp.priority === 'HIGH' || comp.priority === 'CRITICAL' ? 'danger' : 'warning'} className="text-[10px]">
                      {comp.priority}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-xs text-foreground line-clamp-1">{comp.title}</h4>
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {comp.locationType}
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t.slaDeadline || 'Due 10:30 AM'}</span>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Task Detail & Work Log */}
          {activeTask && (
            <Card className="lg:col-span-2 border border-border bg-card">
              <CardHeader className="p-6 pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-primary">{activeTask.complaint?.ticketNumber}</span>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Categorized: {activeTask.complaint?.category}
                    </Badge>
                  </div>
                  <Badge variant={activeTask.status === 'RESOLVED' ? 'success' : 'warning'} className="text-xs">
                    {activeTask.status}
                  </Badge>
                </div>

                <CardTitle className="text-lg mt-2">{activeTask.complaint?.title}</CardTitle>
                <CardDescription className="text-xs">{activeTask.complaint?.description}</CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Location & Student Info */}
                <div className="grid grid-cols-2 gap-4 text-xs p-3.5 rounded-lg bg-muted/40 border border-border">
                  <div>
                    <span className="text-muted-foreground font-medium">Location:</span>
                    <div className="font-semibold text-foreground mt-0.5">{activeTask.complaint?.locationType || 'Room B-204'}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground font-medium">Student Contact:</span>
                    <div className="font-semibold text-foreground mt-0.5">
                      {activeTask.complaint?.student?.user?.name} ({activeTask.complaint?.student?.user?.phone || '+91 9876543200'})
                    </div>
                  </div>
                </div>

                {/* Quick Technician Actions */}
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
                  {activeTask.status !== 'IN_PROGRESS' && activeTask.status !== 'RESOLVED' && (
                    <Button onClick={() => handleUpdateStatus(activeTask.id, 'IN_PROGRESS')} className="gap-2 text-xs">
                      <Play className="w-3.5 h-3.5" />
                      Start Task
                    </Button>
                  )}

                  {activeTask.status === 'IN_PROGRESS' && (
                    <Button onClick={() => handleUpdateStatus(activeTask.id, 'PAUSED')} variant="outline" className="gap-2 text-xs">
                      <Pause className="w-3.5 h-3.5" />
                      Pause Task
                    </Button>
                  )}

                  {activeTask.status !== 'RESOLVED' && (
                    <Button onClick={() => handleUpdateStatus(activeTask.id, 'RESOLVED')} variant="primary" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Mark Resolved
                    </Button>
                  )}
                </div>

                {/* Add Work Note Form */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <label className="text-xs font-semibold text-foreground">Add Work Note / Parts Required</label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Example: Replaced fan motor capacitor (2.5mFD)."
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      className="text-xs"
                    />
                    <Button
                      onClick={() => handleUpdateStatus(activeTask.id, activeTask.status || 'IN_PROGRESS')}
                      disabled={!noteInput.trim()}
                      size="sm"
                      className="gap-1.5 shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Save Note
                    </Button>
                  </div>
                </div>

                {/* Work Log Timeline */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Work Log Stream</h4>
                  <div className="space-y-2">
                    {activeTask.complaint?.updates?.map((u: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-md bg-muted/40 border border-border text-xs flex justify-between gap-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground">{u.message}</p>
                          {u.isWorkNote && <span className="text-[10px] text-primary font-semibold">Technician Note</span>}
                        </div>
                        <span className="text-[11px] text-muted-foreground shrink-0">{u.time || '10:15 AM'}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
