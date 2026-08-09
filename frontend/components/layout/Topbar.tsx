'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Sun, Moon, User, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TopbarProps {
  userName?: string;
  roomDetails?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  userName = 'Rahul Sharma',
  roomDetails = 'Room B-204 · Block B',
}) => {
  const [darkMode, setDarkMode] = useState(false);
  const [unreadCount] = useState(3);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-xs px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Search & Command Palette Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
            window.dispatchEvent(event);
          }}
          className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 border border-border rounded-md px-3 py-1.5 hover:border-primary/50 transition-colors w-64 justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search students, complaints...</span>
          </div>
          <kbd className="text-[10px] bg-background border border-border rounded px-1.5 py-0.5 font-mono flex items-center gap-0.5">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </Button>

        {/* Notification Bell */}
        <div className="relative">
          <Button variant="ghost" size="icon" title="Notifications">
            <Bell className="w-4 h-4 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger animate-pulse" />
            )}
          </Button>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* User Pill */}
        <div className="flex items-center gap-3 pl-1">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center border border-primary/20">
            {userName.charAt(0)}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-foreground leading-none">{userName}</div>
            <div className="text-[11px] text-muted-foreground leading-tight mt-0.5">{roomDetails}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
