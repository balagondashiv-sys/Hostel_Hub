'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, ShieldCheck, Wrench, AlertTriangle, Layers, Search, Filter } from 'lucide-react';

export default function AdminDashboardPage() {
  const [selectedBlock, setSelectedBlock] = useState('Block B');
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [adminData, setAdminData] = useState<any>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('hostelhub_token');
        const res = await fetch('/api/admin/overview', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const json = await res.json();
        if (json.success) {
          setAdminData(json.data);
        }
      } catch (e) {
        console.error('Failed to load admin overview:', e);
      }
    };

    fetchAdminData();
  }, []);

  const counts = adminData?.counts || {
    totalUsers: 38,
    totalStudents: 30,
    totalWardens: 2,
    totalStaff: 5,
    totalRooms: 108,
    totalComplaints: 24,
  };

  // Generate demo 12 room matrix per block
  const generateBlockRooms = (blockName: string) => {
    const prefix = blockName.split(' ')[1];
    return Array.from({ length: 12 }, (_, i) => {
      const rNum = `${prefix}-${101 + i}`;
      let status = 'AVAILABLE';
      let occ = 3;
      if (i === 3) {
        status = 'FULL';
        occ = 4;
      } else if (i === 7) {
        status = 'MAINTENANCE';
        occ = 0;
      } else if (i === 1) {
        status = 'AVAILABLE';
        occ = 2;
      }
      return {
        roomNumber: rNum,
        occupancy: `${occ}/4`,
        status,
        floor: Math.floor(i / 4) + 1,
      };
    });
  };

  const blockRooms = generateBlockRooms(selectedBlock);

  return (
    <AppShell role="ADMIN" userName="Dr. Vikram Sarabhai" roomDetails="Master Administrator">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Admin Console</h1>
            <p className="text-xs text-muted-foreground">Interactive room occupancy visualizer & campus infrastructure manager</p>
          </div>
          <Badge variant="outline" className="bg-purple-500/10 text-purple-600 border-purple-500/20 text-xs px-3 py-1 font-semibold">
            Superuser Privilege
          </Badge>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Registered Users</div>
              <div className="text-xl font-bold text-foreground">{counts.totalUsers}</div>
            </div>
          </Card>

          <Card className="p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Total Campus Rooms</div>
              <div className="text-xl font-bold text-foreground">{counts.totalRooms}</div>
            </div>
          </Card>

          <Card className="p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Maintenance Staff</div>
              <div className="text-xl font-bold text-foreground">{counts.totalStaff}</div>
            </div>
          </Card>

          <Card className="p-4 border border-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground font-medium">Hostel Wardens</div>
              <div className="text-xl font-bold text-foreground">{counts.totalWardens}</div>
            </div>
          </Card>
        </div>

        {/* ROOM OCCUPANCY VISUALIZER MATRIX */}
        <Card className="border border-border bg-card">
          <CardHeader className="p-6 pb-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary" />
                Room Occupancy Visualizer
              </CardTitle>
              <CardDescription className="text-xs">
                Real-time spatial floorplan matrix with live bed allocation statuses
              </CardDescription>
            </div>

            {/* Block Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-muted border border-border text-xs font-semibold">
              {['Block A', 'Block B', 'Block C'].map((blk) => (
                <button
                  key={blk}
                  onClick={() => setSelectedBlock(blk)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${
                    selectedBlock === blk ? 'bg-background text-foreground shadow-xs' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {blk}
                </button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/40" />
                <span className="text-muted-foreground">Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-indigo-500/20 border border-indigo-500/40" />
                <span className="text-muted-foreground">Full (4/4)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/40" />
                <span className="text-muted-foreground">Under Maintenance</span>
              </div>
            </div>

            {/* Interactive Room Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {blockRooms.map((rm) => {
                const isFull = rm.status === 'FULL';
                const isMaint = rm.status === 'MAINTENANCE';

                return (
                  <div
                    key={rm.roomNumber}
                    onClick={() => setSelectedRoom(rm)}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer hover:-translate-y-0.5 ${
                      isFull
                        ? 'bg-indigo-500/10 border-indigo-500/30'
                        : isMaint
                        ? 'bg-amber-500/10 border-amber-500/30'
                        : 'bg-emerald-500/10 border-emerald-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs font-mono">{rm.roomNumber}</span>
                      <span className="text-[10px] font-semibold text-muted-foreground">F{rm.floor}</span>
                    </div>

                    <div className="text-[11px] font-semibold mt-2 flex items-center justify-between">
                      <span>{rm.occupancy}</span>
                      <Badge
                        variant={isFull ? 'default' : isMaint ? 'warning' : 'success'}
                        className="text-[9px] px-1.5 py-0"
                      >
                        {rm.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Room Details Drawer Preview */}
            {selectedRoom && (
              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm text-primary">Selected Room: {selectedRoom.roomNumber}</span>
                  <Badge variant="outline">{selectedRoom.status}</Badge>
                </div>
                <p className="text-muted-foreground">
                  Current Occupancy: {selectedRoom.occupancy} · Assigned to {selectedBlock} · Floor {selectedRoom.floor}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
