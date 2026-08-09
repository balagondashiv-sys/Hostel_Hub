'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Home,
  AlertTriangle,
  CalendarDays,
  UtensilsCrossed,
  Bell,
  CheckSquare,
  CreditCard,
  Settings,
  ShieldAlert,
  Users,
  Wrench,
  BarChart3,
  Building2,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  role?: 'STUDENT' | 'WARDEN' | 'MAINTENANCE' | 'ADMIN';
}

export const Sidebar: React.FC<SidebarProps> = ({ role = 'STUDENT' }) => {
  const pathname = usePathname();

  const studentNav = [
    { name: 'Dashboard', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'My Room', href: '/dashboard/student/room', icon: Home },
    { name: 'Complaints', href: '/dashboard/student/complaints', icon: AlertTriangle },
    { name: 'Mess Hub', href: '/dashboard/student/mess', icon: UtensilsCrossed },
    { name: 'Leave Portal', href: '/dashboard/student/leave', icon: CalendarDays },
    { name: 'Notices', href: '/dashboard/student/notices', icon: Bell },
    { name: 'Attendance', href: '/dashboard/student/attendance', icon: CheckSquare },
    { name: 'Fees & Receipts', href: '/dashboard/student/fees', icon: CreditCard },
  ];

  const wardenNav = [
    { name: 'Operations Center', href: '/dashboard/warden', icon: LayoutDashboard },
    { name: 'Hostel Health', href: '/dashboard/warden/health', icon: BarChart3 },
    { name: 'Complaints Escalation', href: '/dashboard/warden/complaints', icon: AlertTriangle },
    { name: 'Leave Approvals', href: '/dashboard/warden/leave', icon: CalendarDays },
    { name: 'Mess Monitor', href: '/dashboard/warden/mess', icon: UtensilsCrossed },
    { name: 'Broadcast Notice', href: '/dashboard/warden/notices', icon: Bell },
    { name: 'Attendance Log', href: '/dashboard/warden/attendance', icon: CheckSquare },
  ];

  const maintenanceNav = [
    { name: 'Task Queue', href: '/dashboard/maintenance', icon: Wrench },
    { name: 'SLA Performance', href: '/dashboard/maintenance/performance', icon: BarChart3 },
    { name: 'Parts & Inventory', href: '/dashboard/maintenance/inventory', icon: Building2 },
  ];

  const adminNav = [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Room Visualizer', href: '/dashboard/admin/rooms', icon: Building2 },
    { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
    { name: 'Analytics & Health', href: '/dashboard/admin/analytics', icon: BarChart3 },
    { name: 'System Settings', href: '/dashboard/admin/settings', icon: Settings },
  ];

  const navItems =
    role === 'WARDEN'
      ? wardenNav
      : role === 'MAINTENANCE'
      ? maintenanceNav
      : role === 'ADMIN'
      ? adminNav
      : studentNav;

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
            H
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight leading-none text-foreground">
              HostelHub
            </h1>
            <span className="text-[10px] font-medium text-muted-foreground tracking-wide uppercase">
              Smart Living OS
            </span>
          </div>
        </Link>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-6 py-3 border-b border-border/50 bg-muted/30 flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-medium">Role Scope:</span>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          {role}
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className={cn('w-4 h-4', isActive ? 'text-primary-foreground' : 'text-muted-foreground')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* Emergency Quick Trigger */}
      <div className="p-4 border-t border-border">
        <Link
          href="/dashboard/emergency"
          className="flex items-center justify-center gap-2 w-full px-3 py-2 rounded-md bg-danger/10 text-danger border border-danger/20 text-xs font-semibold hover:bg-danger/20 transition-colors"
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Emergency Alert</span>
        </Link>
      </div>
    </aside>
  );
};
