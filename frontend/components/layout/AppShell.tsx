'use client';

import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';

interface AppShellProps {
  children: React.ReactNode;
  role?: 'STUDENT' | 'WARDEN' | 'MAINTENANCE' | 'ADMIN';
  userName?: string;
  roomDetails?: string;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  role = 'STUDENT',
  userName = 'Rahul Sharma',
  roomDetails = 'Room B-204 · Block B',
}) => {
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Desktop Sidebar Rail */}
      <div className="hidden md:block">
        <Sidebar role={role} />
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        <Topbar userName={userName} roomDetails={roomDetails} />
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
