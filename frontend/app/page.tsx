'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldCheck, UserCheck, Wrench, GraduationCap, ArrowRight, Activity, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-between p-6 md:p-12">
      {/* Top Brand Header */}
      <header className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-md">
            H
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight">HostelHub</h1>
            <p className="text-xs text-muted-foreground">Smart Campus Living OS</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="outline">Sign In</Button>
          </Link>
          <Link href="/dashboard/student">
            <Button>Enter Demo Portal</Button>
          </Link>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-4xl w-full mx-auto my-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Hostel Operating System</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
          Live better. Report faster. <br />
          <span className="bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
            Stay connected.
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Centralizing complaint management, mess schedules, leave approvals, visual room allocations, and real-time campus updates into one intelligent platform.
        </p>

        {/* Quick Role Portal Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-8">
          {/* Student */}
          <Link href="/dashboard/student">
            <Card className="hover:border-primary/50 transition-all hover:-translate-y-1 cursor-pointer h-full">
              <CardHeader className="p-4 pb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-2">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <CardTitle className="text-base">Student Portal</CardTitle>
                <CardDescription className="text-xs">Campus Pulse, AI complaints, Mess rating & Leave requests.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2 text-xs font-semibold text-primary flex items-center gap-1">
                Launch Portal <ArrowRight className="w-3 h-3" />
              </CardContent>
            </Card>
          </Link>

          {/* Warden */}
          <Link href="/dashboard/warden">
            <Card className="hover:border-primary/50 transition-all hover:-translate-y-1 cursor-pointer h-full">
              <CardHeader className="p-4 pb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <UserCheck className="w-4 h-4" />
                </div>
                <CardTitle className="text-base">Warden Console</CardTitle>
                <CardDescription className="text-xs">Hostel Health Score, Leave approvals & Escalations.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2 text-xs font-semibold text-primary flex items-center gap-1">
                Launch Console <ArrowRight className="w-3 h-3" />
              </CardContent>
            </Card>
          </Link>

          {/* Maintenance */}
          <Link href="/dashboard/maintenance">
            <Card className="hover:border-primary/50 transition-all hover:-translate-y-1 cursor-pointer h-full">
              <CardHeader className="p-4 pb-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2">
                  <Wrench className="w-4 h-4" />
                </div>
                <CardTitle className="text-base">Maintenance Queue</CardTitle>
                <CardDescription className="text-xs">Task queue, SLA tracker & fast status updates.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2 text-xs font-semibold text-primary flex items-center gap-1">
                Launch Queue <ArrowRight className="w-3 h-3" />
              </CardContent>
            </Card>
          </Link>

          {/* Admin */}
          <Link href="/dashboard/admin">
            <Card className="hover:border-primary/50 transition-all hover:-translate-y-1 cursor-pointer h-full">
              <CardHeader className="p-4 pb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <CardTitle className="text-base">Admin Dashboard</CardTitle>
                <CardDescription className="text-xs">Room occupancy visualizer, Users & System analytics.</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-2 text-xs font-semibold text-primary flex items-center gap-1">
                Launch Admin <ArrowRight className="w-3 h-3" />
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-muted-foreground border-t border-border pt-6">
        HostelHub Capstone Project © 2026. Built with Next.js, Express, TypeScript & PostgreSQL.
      </footer>
    </div>
  );
}
