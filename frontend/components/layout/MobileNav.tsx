'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, AlertTriangle, UtensilsCrossed, Bell, User, Plus } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'Complaints', href: '/dashboard/student/complaints', icon: AlertTriangle },
    { name: 'Mess', href: '/dashboard/student/mess', icon: UtensilsCrossed },
    { name: 'Notices', href: '/dashboard/student/notices', icon: Bell },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-40 flex items-center justify-around px-2">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center gap-1 w-12 h-12 rounded-lg text-[10px] font-medium transition-colors',
              isActive ? 'text-primary font-bold' : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-5 h-5" />
            <span>{item.name}</span>
          </Link>
        );
      })}

      {/* Quick Action Floating Action Button */}
      <Link
        href="/dashboard/student/complaints/new"
        className="absolute -top-5 right-6 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center border-2 border-background hover:scale-105 active:scale-95 transition-transform"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </nav>
  );
};
