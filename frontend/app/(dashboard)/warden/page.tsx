'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldAlert, AlertTriangle, CalendarDays, CheckCircle2, XCircle, Activity, Sparkles, TrendingUp, Users, Building2, BarChart3, UtensilsCrossed } from 'lucide-react';

export default function WardenDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWardenData = async () => {
      try {
        const token = localStorage.getItem('hostelhub_token');
        const res = await fetch('/api/warden/dashboard', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const text = await res.text();
        const json = text ? JSON.parse(text) : {};
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error('Failed to load warden dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWardenData();
  }, []);

  const metrics = data?.metrics || {
    totalStudents: 624,
    occupancyPercentage: 91,
    openComplaints: 23,
    criticalComplaints: 3,
    healthScore: 84,
  };

  const pendingLeaves = data?.attentionRequired?.pendingLeaves || [
    {
      id: 'l1',
      student: { user: { name: 'Utkarsh Mishra' }, room: { roomNumber: 'B-301' } },
      reason: 'Attending Inter-College Tech Symposium',
      dates: 'Aug 25 – 27',
    },
  ];

  const highComplaints = data?.attentionRequired?.highPriorityComplaints || [
    {
      id: 'c1',
      ticketNumber: 'TKT-1042',
      title: 'Ceiling Fan grinding noise',
      category: 'ELECTRICAL',
      priority: 'HIGH',
      room: { roomNumber: 'B-204' },
      student: { user: { name: 'Rahul Sharma' } },
    },
  ];

  const insights = data?.insights || [
    'Plumbing complaints increased 18% this week in Block B.',
    'Block B currently has the highest maintenance load (14 active tickets).',
    'Mess dinner satisfaction improved 7% this month following menu updates.',
  ];

  const handleLeaveApproval = async (id: string, action: 'APPROVED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem('hostelhub_token');
      await fetch(`/api/warden/leave/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ action, wardenNotes: `${action} by Warden` }),
      });
      // Refresh local state
      setData((prev: any) => ({
        ...prev,
        attentionRequired: {
          ...prev?.attentionRequired,
          pendingLeaves: prev?.attentionRequired?.pendingLeaves?.filter((l: any) => l.id !== id),
        },
      }));
    } catch (e) {
      console.error('Failed to update leave:', e);
    }
  };

  return (
    <AppShell role="WARDEN" userName="Prof. Rajesh Kumar" roomDetails="Chief Warden · North Campus">
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Warden Operations Center</h1>
            <p className="text-xs text-muted-foreground">Action-oriented hostel health monitoring & leave approvals</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1 font-semibold">
            North Campus Hostels
          </Badge>
        </div>

        {/* Campus Health Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Total Students</div>
              <div className="text-xl font-bold text-foreground">{metrics.totalStudents}</div>
            </div>
          </Card>

          <Card className="p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Occupancy Rate</div>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.occupancyPercentage}%</div>
            </div>
          </Card>

          <Card className="p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Open Complaints</div>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{metrics.openComplaints}</div>
            </div>
          </Card>

          <Card className="p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Critical Issues</div>
              <div className="text-xl font-bold text-red-600 dark:text-red-400">{metrics.criticalComplaints}</div>
            </div>
          </Card>
        </div>

        {/* HOSTEL HEALTH SCORE & INSIGHTS ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hostel Health Score Gauge */}
          <Card className="border border-border bg-card">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Hostel Health Score
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">Operational Metric</Badge>
              </div>
              <CardDescription className="text-xs">Aggregated live operational rating</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2 text-center space-y-4">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-muted/30 stroke-current"
                    strokeWidth="3.5"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-primary stroke-current"
                    strokeDasharray={`${metrics.healthScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold tracking-tight text-foreground">{metrics.healthScore}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">out of 100</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground space-y-1 text-left pt-2 border-t border-border">
                <div className="flex justify-between">
                  <span>Complaint Resolution Speed:</span>
                  <span className="font-semibold text-foreground">Good (88%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Mess Satisfaction:</span>
                  <span className="font-semibold text-foreground">4.2 / 5.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Night Roll Call Compliance:</span>
                  <span className="font-semibold text-foreground">92%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Operational Insights */}
          <Card className="lg:col-span-2 border border-border bg-card">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Operational Intelligence & Insights
              </CardTitle>
              <CardDescription className="text-xs">Data-driven trend indicators generated from historical complaint logs</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-2 space-y-3">
              {insights.map((ins: string, idx: number) => (
                <div key={idx} className="p-3.5 rounded-lg border border-border bg-muted/20 flex items-start gap-3 text-xs">
                  <TrendingUp className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <p className="font-medium text-foreground">{ins}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* ATTENTION REQUIRED SECTION */}
        <Card className="border border-border">
          <CardHeader className="p-5 pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2 text-danger">
                <AlertTriangle className="w-4 h-4" />
                Attention Required
              </CardTitle>
              <CardDescription className="text-xs">Pending leave applications & high-priority escalations</CardDescription>
            </div>
            <Badge variant="danger" className="text-[10px]">Action Needed</Badge>
          </CardHeader>
          <CardContent className="p-5 pt-2 space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Leave Applications</span>
              {pendingLeaves.map((l: any) => (
                <div key={l.id} className="p-3.5 rounded-lg border border-border bg-card flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-semibold text-foreground">{l.student?.user?.name} ({l.student?.room?.roomNumber || 'B-301'})</div>
                    <p className="text-muted-foreground mt-0.5">{l.reason} · Dates: {l.dates || 'Aug 25-27'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => handleLeaveApproval(l.id, 'APPROVED')} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve
                    </Button>
                    <Button onClick={() => handleLeaveApproval(l.id, 'REJECTED')} size="sm" variant="destructive" className="text-xs gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
