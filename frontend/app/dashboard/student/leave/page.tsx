'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { CalendarDays, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function LeavePortalPage() {
  const [step, setStep] = useState(1);
  const [startDate, setStartDate] = useState('2026-08-25');
  const [endDate, setEndDate] = useState('2026-08-27');
  const [reason, setReason] = useState('');
  const [destination, setDestination] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 9988776655');
  const [submitted, setSubmitted] = useState(false);

  const pastLeaves = [
    { id: '1', dates: 'Aug 15 – 17', reason: 'Independence Day weekend home visit', status: 'APPROVED' },
    { id: '2', dates: 'Jul 10 – 12', reason: 'Family function', status: 'APPROVED' },
  ];

  return (
    <AppShell role="STUDENT" userName="Rahul Sharma" roomDetails="Room B-204 · Block B">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Outstation Leave Portal</h1>
          <p className="text-xs text-muted-foreground">Apply for outstation leave or night out passes in 3 steps</p>
        </div>

        {!submitted ? (
          <Card className="border border-border">
            <CardHeader className="p-6 pb-2">
              <div className="flex items-center justify-between text-xs font-semibold text-primary mb-2">
                <span>STEP {step} OF 3</span>
              </div>
              <CardTitle className="text-lg">
                {step === 1 ? 'Select Leave Dates' : step === 2 ? 'Reason & Emergency Details' : 'Review & Submit'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {step === 1 && (
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Start Date</label>
                    <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">End Date</label>
                    <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Reason for Leave</label>
                    <Input
                      type="text"
                      placeholder="Attending Tech Symposium / Home Visit"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Destination Address</label>
                    <Input
                      type="text"
                      placeholder="IIT Delhi / Home Address"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-medium text-foreground">Emergency Contact Phone</label>
                    <Input
                      type="text"
                      value={emergencyPhone}
                      onChange={(e) => setEmergencyPhone(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs space-y-2">
                  <div className="flex justify-between"><span className="text-muted-foreground">Dates:</span><span className="font-semibold">{startDate} to {endDate}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Reason:</span><span className="font-semibold">{reason || 'Academic Symposium'}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Destination:</span><span className="font-semibold">{destination || 'IIT Delhi'}</span></div>
                </div>
              )}

              <div className="flex justify-between pt-4">
                {step > 1 ? (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
                ) : <div />}

                {step < 3 ? (
                  <Button onClick={() => setStep(step + 1)} className="gap-2">Next <ArrowRight className="w-4 h-4" /></Button>
                ) : (
                  <Button onClick={() => setSubmitted(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                    Submit Leave Request
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-emerald-500/30 bg-emerald-500/5 text-center p-8 space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h2 className="text-lg font-bold text-foreground">Leave Application Submitted!</h2>
            <p className="text-xs text-muted-foreground">Your request has been routed to Warden (Prof. Rajesh Kumar) for approval.</p>
          </Card>
        )}

        {/* Past Leaves */}
        <Card className="border border-border">
          <CardHeader className="p-5 pb-2"><CardTitle className="text-base">Leave Application History</CardTitle></CardHeader>
          <CardContent className="p-5 space-y-2">
            {pastLeaves.map((l) => (
              <div key={l.id} className="p-3 rounded border border-border flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-foreground">{l.reason}</div>
                  <div className="text-[11px] text-muted-foreground">{l.dates}</div>
                </div>
                <Badge variant="success">{l.status}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
