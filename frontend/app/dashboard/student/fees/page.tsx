'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function FeesPage() {
  const [paid, setPaid] = useState(false);

  const fee = {
    title: 'Odd Semester Hostel & Mess Charges 2026',
    amount: 45000,
    dueDate: 'Sept 10, 2026',
    status: paid ? 'PAID' : 'PENDING',
  };

  return (
    <AppShell role="STUDENT" userName="Rahul Sharma" roomDetails="Room B-204 · Block B">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-primary" />
            Hostel Fees & Payment Portal
          </h1>
          <p className="text-xs text-muted-foreground">Semester dues breakdown, receipt downloads & UPI payment options</p>
        </div>

        {/* Fee Summary Card */}
        <Card className="border border-border">
          <CardHeader className="p-6 border-b border-border">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">{fee.title}</CardTitle>
                <CardDescription className="text-xs">Due Date: {fee.dueDate}</CardDescription>
              </div>
              <Badge variant={paid ? 'success' : 'warning'} className="text-xs">
                {fee.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between text-sm p-4 rounded-xl bg-muted/40 border border-border">
              <span className="text-muted-foreground font-medium">Total Payable Dues:</span>
              <span className="text-2xl font-extrabold text-foreground">₹{fee.amount.toLocaleString()}</span>
            </div>

            {paid ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Payment Received via UPI (Ref: TXN9876543210)</span>
                </div>
                <Button size="sm" variant="outline" className="text-xs">
                  Download Receipt
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Button onClick={() => setPaid(true)} className="w-full h-11 text-sm font-semibold gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                  Pay ₹45,000 via Instant UPI / Net Banking
                </Button>
                <p className="text-[11px] text-muted-foreground text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  256-Bit Encrypted Payment Simulation Gateway
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
