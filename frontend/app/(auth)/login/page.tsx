'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Lock, Mail, GraduationCap, UserCheck, Wrench, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('student@hostelhub.demo');
  const [password, setPassword] = useState('demo1234');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    {
      role: 'Student',
      email: 'student@hostelhub.demo',
      icon: GraduationCap,
      target: '/dashboard/student',
      color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    },
    {
      role: 'Warden',
      email: 'warden@hostelhub.demo',
      icon: UserCheck,
      target: '/dashboard/warden',
      color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    },
    {
      role: 'Maintenance',
      email: 'maintenance@hostelhub.demo',
      icon: Wrench,
      target: '/dashboard/maintenance',
      color: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    },
    {
      role: 'Admin',
      email: 'admin@hostelhub.demo',
      icon: ShieldCheck,
      target: '/dashboard/admin',
      color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token
      if (data.data?.token) {
        localStorage.setItem('hostelhub_token', data.data.token);
        localStorage.setItem('hostelhub_user', JSON.stringify(data.data.user));
      }

      // Direct based on role
      const userRole = data.data?.user?.role;
      if (userRole === 'WARDEN') router.push('/dashboard/warden');
      else if (userRole === 'MAINTENANCE') router.push('/dashboard/maintenance');
      else if (userRole === 'ADMIN') router.push('/dashboard/admin');
      else router.push('/dashboard/student');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string, targetPath: string) => {
    setEmail(demoEmail);
    setPassword('demo1234');
    router.push(targetPath);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
          H
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome to HostelHub</h1>
        <p className="text-sm text-muted-foreground mt-1">Smart Campus Living OS · Sign in to continue</p>
      </div>

      <div className="max-w-md w-full space-y-6">
        {/* Main Card */}
        <Card className="border border-border shadow-md">
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription className="text-xs">Enter your hostel credentials to access your portal</CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-0 space-y-4">
            {error && (
              <div className="p-3 rounded-md bg-danger/10 text-danger text-xs font-medium border border-danger/20 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@hostelhub.demo"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-medium text-foreground">Password</label>
                  <span className="text-primary hover:underline cursor-pointer">Forgot?</span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>

            {/* Quick 1-Click Demo Accounts */}
            <div className="pt-4 border-t border-border space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-muted-foreground">Demo Accounts (1-Tap Test):</span>
                <Badge variant="outline" className="text-[10px]">Development Mode</Badge>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((acc) => {
                  const Icon = acc.icon;
                  return (
                    <button
                      key={acc.role}
                      type="button"
                      onClick={() => setDemoAccount(acc.email, acc.target)}
                      className={`p-2.5 rounded-md text-xs font-medium border flex items-center justify-between transition-colors hover:opacity-90 ${acc.color}`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" />
                        <span>{acc.role}</span>
                      </div>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
