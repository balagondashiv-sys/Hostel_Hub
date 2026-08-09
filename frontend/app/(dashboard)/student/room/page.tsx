'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, UserCheck, ShieldCheck, Wrench, Sparkles, Layers, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function StudentRoomPage() {
  const roomInfo = {
    hostel: 'Aryabhatta Hostel',
    block: 'Block B',
    floor: 2,
    roomNumber: 'B-204',
    myBedNumber: 2,
    capacity: 4,
    beds: [
      { bedNumber: 1, status: 'OCCUPIED', occupant: 'Aarav Patel', dept: 'Electronics', isMe: false },
      { bedNumber: 2, status: 'OCCUPIED', occupant: 'Rahul Sharma (You)', dept: 'Computer Science', isMe: true },
      { bedNumber: 3, status: 'OCCUPIED', occupant: 'Aditya Verma', dept: 'Mechanical', isMe: false },
      { bedNumber: 4, status: 'AVAILABLE', occupant: 'Unassigned', dept: '-', isMe: false },
    ],
  };

  return (
    <AppShell role="STUDENT" userName="Rahul Sharma" roomDetails="Room B-204 · Block B">
      <div className="space-y-6">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/student">
              <Button variant="ghost" size="icon" title="Back to Dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Visual Room Blueprint</h1>
              <p className="text-xs text-muted-foreground">
                {roomInfo.hostel} · {roomInfo.block} · Floor {roomInfo.floor} · Room {roomInfo.roomNumber}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs">
            Assigned Bed: Bed #{roomInfo.myBedNumber}
          </Badge>
        </div>

        {/* Blueprint Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Architectural Layout Blueprint */}
          <Card className="lg:col-span-2 border border-border bg-card">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>Room Blueprint Visualizer</span>
                <span className="text-xs text-muted-foreground font-mono">Floorplan Scale 1:20</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Interactive spatial view of beds, window, entrance door, and study desks.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6">
              {/* Outer Room Container */}
              <div className="relative border-4 border-slate-300 dark:border-slate-700 rounded-xl p-6 bg-slate-50 dark:bg-slate-900/50 shadow-inner space-y-6 select-none">
                {/* Top Window Indicator */}
                <div className="w-1/3 mx-auto h-3 bg-sky-400/30 border border-sky-500 rounded flex items-center justify-center text-[10px] text-sky-700 dark:text-sky-300 font-semibold tracking-wider uppercase">
                  🪟 Large Bay Window
                </div>

                {/* Beds Grid 2x2 */}
                <div className="grid grid-cols-2 gap-8 my-8">
                  {roomInfo.beds.map((b) => (
                    <div
                      key={b.bedNumber}
                      className={`p-4 rounded-xl border-2 transition-all relative ${
                        b.isMe
                          ? 'border-primary bg-primary/10 shadow-md ring-2 ring-primary/30'
                          : b.status === 'OCCUPIED'
                          ? 'border-slate-200 dark:border-slate-800 bg-card shadow-xs'
                          : b.status === 'MAINTENANCE'
                          ? 'border-amber-500/40 bg-amber-500/10'
                          : 'border-dashed border-emerald-500/40 bg-emerald-500/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold font-mono">BED #{b.bedNumber}</span>
                        <Badge
                          variant={
                            b.isMe
                              ? 'default'
                              : b.status === 'OCCUPIED'
                              ? 'secondary'
                              : b.status === 'MAINTENANCE'
                              ? 'warning'
                              : 'success'
                          }
                          className="text-[10px]"
                        >
                          {b.isMe ? 'YOU' : b.status}
                        </Badge>
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-foreground">{b.occupant}</div>
                        <div className="text-[11px] text-muted-foreground">{b.dept}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Door & Study Area */}
                <div className="flex items-center justify-between border-t border-dashed border-slate-300 dark:border-slate-700 pt-4 text-xs">
                  <div className="px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 font-medium">
                    🚪 Entrance Door
                  </div>
                  <div className="px-3 py-1.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 font-medium">
                    📚 Study Desks & Storage
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Room Specs & Details */}
          <div className="space-y-6">
            <Card className="border border-border">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base">Room Specifications</CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Hostel:</span>
                  <span className="font-semibold">{roomInfo.hostel}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Block & Floor:</span>
                  <span className="font-semibold">{roomInfo.block} · Floor {roomInfo.floor}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-semibold">{roomInfo.capacity} Students</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Occupancy:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">3 Occupied, 1 Available</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border">
              <CardHeader className="p-5 pb-3">
                <CardTitle className="text-base">Room Assistance</CardTitle>
                <CardDescription className="text-xs">Have an issue with your bed or desk?</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3">
                <Link href="/dashboard/student/complaints/new">
                  <Button className="w-full text-xs gap-2">
                    <Wrench className="w-3.5 h-3.5" />
                    Report Maintenance for Room B-204
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
