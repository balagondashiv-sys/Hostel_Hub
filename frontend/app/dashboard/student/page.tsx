'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  CalendarDays,
  UtensilsCrossed,
  Bell,
  Home,
  CheckCircle2,
  Clock,
  ArrowRight,
  Plus,
  Star,
  Users,
  Sparkles,
  ShieldAlert,
  Activity,
  CreditCard
} from 'lucide-react';

export default function StudentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch student dashboard data
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('hostelhub_token');
        const res = await fetch('/api/dashboard/student', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const text = await res.text();
        const json = text ? JSON.parse(text) : {};
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Fallback demo dataset if offline or loading
  const student = data?.student || {
    name: 'Rahul Sharma',
    rollNumber: 'CS2026-1042',
    department: 'Computer Science',
    hostel: 'Aryabhatta Hostel',
    block: 'Block B',
    roomNumber: 'B-204',
    bedNumber: 2,
    occupancy: '3/4 occupied',
    roommates: [
      { name: 'Aarav Patel', bed: 1, department: 'Electronics' },
      { name: 'Aditya Verma', bed: 3, department: 'Mechanical' },
    ],
  };

  const activityTimeline = data?.activityTimeline || [
    { time: '08:10 AM', text: 'Breakfast menu updated: Idly, Sambar & Coconut Chutney', type: 'MESS' },
    { time: '09:24 AM', text: 'Complaint #TKT-1042 assigned to Electrical Team', type: 'COMPLAINT' },
    { time: '10:05 AM', text: 'New Notice: Water Supply Maintenance in Block B tomorrow', type: 'NOTICE' },
    { time: '11:32 AM', text: 'Leave request for Independence Day weekend APPROVED', type: 'LEAVE' },
    { time: '01:10 PM', text: 'Room B-204 bathroom tap repair completed', type: 'MAINTENANCE' },
  ];

  const complaints = data?.complaints || [
    {
      id: '1',
      ticketNumber: 'TKT-1042',
      title: 'Ceiling Fan making grinding noise',
      category: 'ELECTRICAL',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      createdAt: 'Today, 09:24 AM',
    },
    {
      id: '2',
      ticketNumber: 'TKT-1039',
      title: 'Bathroom tap leakage in B-204',
      category: 'PLUMBING',
      priority: 'CRITICAL',
      status: 'RESOLVED',
      createdAt: 'Yesterday, 02:15 PM',
    },
  ];

  const leaves = data?.leaves || [
    {
      id: '1',
      dates: 'Aug 15 – 17',
      reason: 'Independence Day weekend home visit',
      status: 'APPROVED',
    },
  ];

  const mess = data?.mess || {
    dinnerItems: ['Chapati', 'Paneer Butter Masala', 'Dal Makhani', 'Steamed Rice'],
    rating: 4.2,
  };

  const attendanceRate = data?.attendanceRate || 92;

  return (
    <AppShell role="STUDENT" userName={student.name} roomDetails={`Room ${student.roomNumber} · ${student.block}`}>
      <div className="space-y-6">
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border rounded-xl p-6 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Good morning, {student.name.split(' ')[0]} 👋</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
                Active Resident
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Room {student.roomNumber} · {student.block} · {student.hostel} · Bed {student.bedNumber}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/student/complaints/new">
              <Button className="gap-2 shadow-xs">
                <Plus className="w-4 h-4" />
                Report Issue
              </Button>
            </Link>
            <Link href="/dashboard/student/leave">
              <Button variant="outline" className="gap-2">
                <CalendarDays className="w-4 h-4" />
                Request Leave
              </Button>
            </Link>
          </div>
        </div>

        {/* QUICK ACTIONS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/dashboard/student/complaints/new">
            <Card className="hover:border-primary/50 transition-all hover:bg-muted/30 cursor-pointer p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Report Issue</div>
                <div className="text-xs text-muted-foreground">AI Complaint composer</div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/student/leave">
            <Card className="hover:border-primary/50 transition-all hover:bg-muted/30 cursor-pointer p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Request Leave</div>
                <div className="text-xs text-muted-foreground">3-Step out pass</div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/student/mess">
            <Card className="hover:border-primary/50 transition-all hover:bg-muted/30 cursor-pointer p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <UtensilsCrossed className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Mess Hub</div>
                <div className="text-xs text-muted-foreground">Menu & Rate dinner</div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard/student/notices">
            <Card className="hover:border-primary/50 transition-all hover:bg-muted/30 cursor-pointer p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">View Notices</div>
                <div className="text-xs text-muted-foreground">Campus broadcasts</div>
              </div>
            </Card>
          </Link>
        </div>

        {/* MAIN DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT 2 COLUMNS */}
          <div className="lg:col-span-2 space-y-6">
            {/* CAMPUS PULSE TIMELINE */}
            <Card className="border border-border">
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" />
                    <CardTitle className="text-base">Today at Hostel</CardTitle>
                  </div>
                  <CardDescription className="text-xs mt-0.5">Live campus activity feed & operational events</CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Live Stream
                </Badge>
              </CardHeader>
              <CardContent className="p-5 pt-2">
                <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {activityTimeline.map((act: any, idx: number) => (
                    <div key={idx} className="relative flex items-start justify-between gap-4 text-xs">
                      <span className="absolute -left-[23px] top-0.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-card" />
                      <div className="space-y-0.5">
                        <p className="font-medium text-foreground leading-snug">{act.text}</p>
                        <span className="text-[11px] text-muted-foreground">{act.time}</span>
                      </div>
                      <Badge variant="secondary" className="text-[10px] shrink-0 font-mono">
                        {act.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* MY REQUESTS & COMPLAINTS */}
            <Card className="border border-border">
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base">My Active Requests</CardTitle>
                  <CardDescription className="text-xs">Complaints and leave tickets status</CardDescription>
                </div>
                <Link href="/dashboard/student/complaints" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </CardHeader>
              <CardContent className="p-5 pt-2 space-y-3">
                {complaints.map((c: any) => (
                  <div key={c.id} className="p-3.5 rounded-lg border border-border bg-muted/20 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-muted-foreground">{c.ticketNumber}</span>
                        <h4 className="font-semibold text-xs text-foreground">{c.title}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{c.category}</span>
                        <span>·</span>
                        <span>{c.createdAt}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        c.status === 'RESOLVED'
                          ? 'success'
                          : c.status === 'IN_PROGRESS'
                          ? 'warning'
                          : 'secondary'
                      }
                      className="text-[11px]"
                    >
                      {c.status.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}

                {leaves.map((l: any) => (
                  <div key={l.id} className="p-3.5 rounded-lg border border-border bg-muted/20 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px]">Leave</Badge>
                        <h4 className="font-semibold text-xs text-foreground">{l.reason}</h4>
                      </div>
                      <p className="text-[11px] text-muted-foreground">Dates: {l.dates}</p>
                    </div>
                    <Badge variant="success" className="text-[11px]">
                      {l.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* MY ROOM SNAPSHOT */}
            <Card className="border border-border">
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Home className="w-4 h-4 text-primary" />
                    My Room
                  </CardTitle>
                  <CardDescription className="text-xs">Room {student.roomNumber} · Bed {student.bedNumber}</CardDescription>
                </div>
                <Link href="/dashboard/student/room">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    Visual Blueprint <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-5 pt-2 space-y-3">
                <div className="flex justify-between items-center text-xs p-2.5 rounded-md bg-muted/40 border border-border/60">
                  <span className="text-muted-foreground font-medium">Room Status:</span>
                  <span className="font-semibold text-foreground">{student.occupancy}</span>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground">Roommates:</span>
                  {student.roommates.map((rm: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 rounded border border-border/40">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                          {rm.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{rm.name}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">Bed {rm.bed}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* MESS SNAPSHOT */}
            <Card className="border border-border">
              <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <UtensilsCrossed className="w-4 h-4 text-amber-500" />
                    Today's Dinner Menu
                  </CardTitle>
                  <CardDescription className="text-xs">07:30 PM – 09:30 PM</CardDescription>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  {mess.rating}/5
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-2 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {mess.dinnerItems.map((item: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs font-normal">
                      {item}
                    </Badge>
                  ))}
                </div>

                <Link href="/dashboard/student/mess">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5 mt-2">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    Rate Dinner & Provide Feedback
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* ATTENDANCE PROGRESS RING */}
            <Card className="border border-border">
              <CardHeader className="p-5 pb-2">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Hostel Attendance</span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{attendanceRate}%</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-muted/40 stroke-current"
                      strokeWidth="4"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500 stroke-current"
                      strokeDasharray={`${attendanceRate}, 100`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">
                    {attendanceRate}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-medium text-foreground">Night Roll Call</div>
                  <p className="text-[11px] text-muted-foreground">30-day compliance is excellent. Keep it up!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
