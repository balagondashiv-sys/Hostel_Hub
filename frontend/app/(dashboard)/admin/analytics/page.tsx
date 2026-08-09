'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AnalyticsDashboardPage() {
  const categoryStats = [
    { name: 'Electrical', count: 12, pct: 42 },
    { name: 'Plumbing', count: 9, pct: 31 },
    { name: 'Furniture', count: 5, pct: 17 },
    { name: 'Cleaning', count: 3, pct: 10 },
  ];

  const blockStats = [
    { name: 'Block B', count: 14, pct: 48 },
    { name: 'Block A', count: 9, pct: 31 },
    { name: 'Block C', count: 6, pct: 21 },
  ];

  return (
    <AppShell role="ADMIN" userName="Dr. Vikram Sarabhai" roomDetails="Master Administrator">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Hostel Operations Analytics
          </h1>
          <p className="text-xs text-muted-foreground">Answering key operational questions through data distribution insights</p>
        </div>

        {/* Question 1: How quickly are complaints being resolved? */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 border border-border">
            <div className="text-xs font-semibold text-muted-foreground">Avg Resolution Speed</div>
            <div className="text-2xl font-extrabold text-foreground mt-1">2.4 Hours</div>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">18% faster than last month</p>
          </Card>

          <Card className="p-5 border border-border">
            <div className="text-xs font-semibold text-muted-foreground">Resolution Rate</div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">89.2%</div>
            <p className="text-[11px] text-muted-foreground mt-1">24 of 27 tickets resolved within SLA</p>
          </Card>

          <Card className="p-5 border border-border">
            <div className="text-xs font-semibold text-muted-foreground">Mess Satisfaction</div>
            <div className="text-2xl font-extrabold text-amber-500 mt-1">4.3 / 5.0</div>
            <p className="text-[11px] text-muted-foreground mt-1">Based on 142 student ratings</p>
          </Card>
        </div>

        {/* Question 2: Which category & block has the highest load? */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-border">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base">Complaints by Maintenance Category</CardTitle>
              <CardDescription className="text-xs">Which systems break most frequently?</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {categoryStats.map((c) => (
                <div key={c.name} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>{c.name}</span>
                    <span>{c.count} Tickets ({c.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-border">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base">Maintenance Load by Hostel Block</CardTitle>
              <CardDescription className="text-xs">Which block requires proactive inspection?</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {blockStats.map((b) => (
                <div key={b.name} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span>{b.name}</span>
                    <span>{b.count} Issues ({b.pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${b.pct}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
