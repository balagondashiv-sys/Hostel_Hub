'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, ShieldAlert, Sparkles, Calendar } from 'lucide-react';

export default function NoticeFeedPage() {
  const notices = [
    {
      id: '1',
      title: 'IMPORTANT: Water Supply Interruption - Block B',
      content: 'Scheduled plumbing pipeline maintenance in Block B tomorrow from 10:00 AM to 1:00 PM. Please store sufficient water.',
      type: 'MAINTENANCE',
      isEmergency: true,
      author: 'Warden Office',
      date: 'Aug 09, 2026',
    },
    {
      id: '2',
      title: 'Hostel Cultural Night Registrations Open',
      content: 'Registrations are open for the annual Hostel Night music & drama competitions. Contact Block Reps by Friday.',
      type: 'EVENT',
      isEmergency: false,
      author: 'Cultural Committee',
      date: 'Aug 08, 2026',
    },
    {
      id: '3',
      title: 'Revised Mess Timings for Independence Day',
      content: 'Breakfast will be served from 07:30 AM to 10:00 AM on August 15th.',
      type: 'MESS',
      isEmergency: false,
      author: 'Mess Manager',
      date: 'Aug 07, 2026',
    },
  ];

  return (
    <AppShell role="STUDENT" userName="Rahul Sharma" roomDetails="Room B-204 · Block B">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Notice Feed & Campus Broadcasts
          </h1>
          <p className="text-xs text-muted-foreground">Official notifications, emergency maintenance alerts, and hostel events</p>
        </div>

        <div className="space-y-4">
          {notices.map((n) => (
            <Card
              key={n.id}
              className={`border transition-all ${
                n.isEmergency
                  ? 'border-red-500/50 bg-red-500/5 dark:bg-red-950/10 shadow-sm'
                  : 'border-border bg-card'
              }`}
            >
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {n.isEmergency && <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse shrink-0" />}
                    <CardTitle className={`text-base ${n.isEmergency ? 'text-red-700 dark:text-red-400 font-bold' : ''}`}>
                      {n.title}
                    </CardTitle>
                  </div>
                  <Badge variant={n.isEmergency ? 'danger' : 'secondary'} className="text-[10px]">
                    {n.type}
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-1">
                  <span>By {n.author}</span>
                  <span>·</span>
                  <span>{n.date}</span>
                </div>
              </CardHeader>
              <CardContent className="p-5 pt-2 text-xs text-foreground leading-relaxed">
                {n.content}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
