'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ShieldAlert, AlertOctagon, Flame, Stethoscope, Zap, Droplets, Shield, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function EmergencyModePage() {
  const [category, setCategory] = useState('MEDICAL');
  const [location, setLocation] = useState('Room B-204');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { name: 'FIRE', icon: Flame, color: 'text-red-500 border-red-500/40 bg-red-500/10' },
    { name: 'MEDICAL', icon: Stethoscope, color: 'text-rose-500 border-rose-500/40 bg-rose-500/10' },
    { name: 'SECURITY', icon: Shield, color: 'text-amber-500 border-amber-500/40 bg-amber-500/10' },
    { name: 'ELECTRICAL', icon: Zap, color: 'text-yellow-500 border-yellow-500/40 bg-yellow-500/10' },
    { name: 'WATER', icon: Droplets, color: 'text-sky-500 border-sky-500/40 bg-sky-500/10' },
  ];

  return (
    <AppShell role="STUDENT" userName="Rahul Sharma" roomDetails="Room B-204 · Block B">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard/student">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-danger tracking-tight flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 animate-bounce" />
              EMERGENCY RED ALERT DISPATCH
            </h1>
            <p className="text-xs text-muted-foreground">High-priority instant dispatch to Warden & Campus Control Room</p>
          </div>
        </div>

        {!submitted ? (
          <Card className="border-2 border-danger bg-danger/5 shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-lg text-danger">Select Emergency Category</CardTitle>
              <CardDescription className="text-xs">
                Use this strictly for urgent safety, medical, or fire emergencies requiring immediate campus intervention.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelected = category === c.name;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => setCategory(c.name)}
                      className={`p-3.5 rounded-xl border font-bold text-xs flex flex-col items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-danger bg-danger text-white shadow-md scale-105'
                          : 'border-border bg-card text-foreground hover:border-danger/50'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span>{c.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-foreground">Exact Location</label>
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="bg-card text-xs font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Brief Incident Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the emergency (e.g. Student experiencing severe high fever / electrical short circuit)."
                  rows={3}
                  className="w-full rounded-lg border border-input bg-card p-3 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger"
                />
              </div>

              <Button
                onClick={() => setSubmitted(true)}
                disabled={!description.trim()}
                className="w-full h-12 text-sm font-bold bg-danger hover:bg-danger/90 text-white gap-2 shadow-md"
              >
                <ShieldAlert className="w-5 h-5" />
                BROADCAST EMERGENCY ALERT NOW
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-2 border-emerald-500 bg-emerald-500/10 text-center p-8 space-y-4 shadow-xl">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-foreground">Emergency Alert Broadcasted!</h2>
              <p className="text-xs text-muted-foreground">Category: {category} · Location: {location}</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border text-xs text-left max-w-sm mx-auto space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Broadcasted Time:</span>
                <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Warden Notification:</span>
                <Badge variant="success">DISPATCHED</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Control Desk:</span>
                <Badge variant="success">ACKNOWLEDGED</Badge>
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
