'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckCircle2, Clock, Wrench, UserCheck, Star, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('hostelhub_token');
        const res = await fetch('/api/complaints', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json.success && json.data) {
          setComplaints(json.data);
          if (json.data.length > 0) setSelectedTicket(json.data[0]);
        }
      } catch (err) {
        console.error('Failed to load complaints:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Fallback demo complaint dataset
  const demoTickets = [
    {
      id: '1',
      ticketNumber: 'TKT-1042',
      title: 'Ceiling Fan making grinding noise',
      description: 'The ceiling fan in Room B-204 is making an extremely loud grinding noise and spinning slowly.',
      category: 'ELECTRICAL',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      locationType: 'Room',
      assignedTo: { user: { name: 'Suresh Electrician', phone: '+91 9876543221' } },
      estimatedResolution: 'Within 2 hours',
      createdAt: 'Today, 09:24 AM',
      updates: [
        { time: '09:24 AM', message: 'Reported issue: Ceiling Fan making grinding noise.', status: 'REPORTED' },
        { time: '09:30 AM', message: 'Assigned to Electrical Team (Suresh Electrician).', status: 'ASSIGNED' },
        { time: '10:15 AM', message: 'Technician reached room B-204. Replacing fan motor capacitor.', status: 'IN_PROGRESS', isWorkNote: true },
      ],
    },
    {
      id: '2',
      ticketNumber: 'TKT-1039',
      title: 'Bathroom tap leakage in B-204',
      description: 'Water tap is leaking continuously and spreading water across the floor.',
      category: 'PLUMBING',
      priority: 'CRITICAL',
      status: 'RESOLVED',
      locationType: 'Bathroom',
      assignedTo: { user: { name: 'Ramesh Plumber', phone: '+91 9876543220' } },
      estimatedResolution: 'Resolved',
      rating: 5,
      feedback: 'Fixed within 45 mins. Great job!',
      createdAt: 'Yesterday, 02:15 PM',
      updates: [
        { time: '02:15 PM', message: 'Reported issue: Bathroom tap leakage.', status: 'REPORTED' },
        { time: '03:00 PM', message: 'Replaced tap washer and sealed thread leakage.', status: 'RESOLVED', isWorkNote: true },
      ],
    },
  ];

  const ticketsList = complaints.length > 0 ? complaints : demoTickets;
  const activeTicket = selectedTicket || ticketsList[0];

  // Helper timeline steps
  const getTimelineSteps = (status: string) => {
    const isResolved = status === 'RESOLVED';
    const isInProgress = status === 'IN_PROGRESS' || isResolved;
    const isAssigned = status === 'ASSIGNED' || isInProgress;

    return [
      { name: 'Reported', completed: true, active: false },
      { name: 'Assigned', completed: isAssigned, active: status === 'ASSIGNED' },
      { name: 'Technician on the way', completed: isInProgress, active: false },
      { name: 'Repair in progress', completed: isInProgress, active: status === 'IN_PROGRESS' },
      { name: 'Resolved', completed: isResolved, active: isResolved },
    ];
  };

  return (
    <AppShell role="STUDENT" userName="Rahul Sharma" roomDetails="Room B-204 · Block B">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Complaints & Repair Tracker</h1>
            <p className="text-xs text-muted-foreground">Track resolution status & vertical progress updates in real-time</p>
          </div>
          <Link href="/dashboard/student/complaints/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Report New Issue
            </Button>
          </Link>
        </div>

        {/* Master-Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Tickets List */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Your Tickets</h3>
            {ticketsList.map((t) => (
              <Card
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 border transition-all cursor-pointer ${
                  activeTicket?.id === t.id ? 'border-primary ring-1 ring-primary/30 bg-primary/5' : 'border-border hover:border-primary/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-muted-foreground">{t.ticketNumber}</span>
                  <Badge
                    variant={t.status === 'RESOLVED' ? 'success' : t.status === 'IN_PROGRESS' ? 'warning' : 'secondary'}
                    className="text-[10px]"
                  >
                    {t.status.replace('_', ' ')}
                  </Badge>
                </div>
                <h4 className="font-semibold text-xs text-foreground line-clamp-1">{t.title}</h4>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground mt-2">
                  <span>{t.category}</span>
                  <span>{t.createdAt}</span>
                </div>
              </Card>
            ))}
          </div>

          {/* Right: Vertical Progress Timeline & Work Log */}
          {activeTicket && (
            <Card className="lg:col-span-2 border border-border bg-card">
              <CardHeader className="p-6 pb-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-primary">{activeTicket.ticketNumber}</span>
                    <Badge variant={activeTicket.priority === 'HIGH' || activeTicket.priority === 'CRITICAL' ? 'danger' : 'warning'}>
                      {activeTicket.priority} PRIORITY
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs">Location: {activeTicket.locationType || 'Room'}</Badge>
                </div>

                <CardTitle className="text-lg mt-2">{activeTicket.title}</CardTitle>
                <CardDescription className="text-xs">{activeTicket.description}</CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Vertical Progress Timeline */}
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Vertical Resolution Status</h4>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-3">
                    {getTimelineSteps(activeTicket.status).map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            step.completed
                              ? 'bg-emerald-500 text-white'
                              : step.active
                              ? 'bg-primary text-white animate-pulse'
                              : 'bg-muted text-muted-foreground border border-border'
                          }`}
                        >
                          {step.completed ? '✓' : idx + 1}
                        </div>
                        <span className={`font-medium ${step.completed || step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technician & Work Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
                    <span className="text-muted-foreground">Assigned Technician:</span>
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-primary" />
                      {activeTicket.assignedTo?.user?.name || 'Suresh Electrician'}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg border border-border bg-card space-y-1">
                    <span className="text-muted-foreground">Est. Response Resolution:</span>
                    <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {activeTicket.estimatedResolution || 'Within 2 hours'}
                    </div>
                  </div>
                </div>

                {/* Updates Log Stream */}
                {activeTicket.updates && activeTicket.updates.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Work Audit Log</h4>
                    <div className="space-y-2">
                      {activeTicket.updates.map((u: any, i: number) => (
                        <div key={i} className="p-3 rounded-md bg-muted/40 border border-border text-xs flex justify-between gap-4">
                          <div>
                            <p className="font-medium text-foreground">{u.message}</p>
                            {u.isWorkNote && <span className="text-[10px] text-primary font-semibold">Technician Work Note</span>}
                          </div>
                          <span className="text-[11px] text-muted-foreground shrink-0">{u.time || 'Today'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
