'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Calendar } from 'lucide-react';

export default function AttendancePage() {
  const monthDays = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    status: i === 14 || i === 15 ? 'ON_LEAVE' : i === 22 ? 'ABSENT' : 'PRESENT',
  }));

  return (
    <AppShell role="STUDENT" userName="Rahul Sharma" roomDetails="Room B-204 · Block B">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-emerald-500" />
              Night Roll Call Attendance
            </h1>
            <p className="text-xs text-muted-foreground">Monthly compliance rate and roll call calendar log</p>
          </div>
          <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 font-bold text-lg">
            92% Compliance
          </div>
        </div>

        <Card className="border border-border">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base">August 2026 Roll Call Calendar</CardTitle>
            <CardDescription className="text-xs">Green = Present, Red = Absent, Amber = On Leave</CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid grid-cols-7 gap-2 text-center text-xs">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                <div key={d} className="font-bold text-muted-foreground py-1">{d}</div>
              ))}
              {monthDays.map((d) => (
                <div
                  key={d.day}
                  className={`p-2.5 rounded-md font-semibold ${
                    d.status === 'PRESENT'
                      ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                      : d.status === 'ON_LEAVE'
                      ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                      : 'bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30'
                  }`}
                >
                  {d.day}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
