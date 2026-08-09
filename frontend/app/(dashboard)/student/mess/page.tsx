'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, Star, Calendar, CheckCircle2 } from 'lucide-react';

export default function MessHubPage() {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const menus: any = {
    Monday: {
      breakfast: ['Idly', 'Sambar', 'Coconut Chutney', 'Tea / Coffee'],
      lunch: ['Jeera Rice', 'Dal Tadka', 'Aloo Gobi', 'Chapati', 'Curd'],
      dinner: ['Butter Chapati', 'Paneer Butter Masala', 'Dal Makhani', 'Steamed Rice', 'Gulab Jamun'],
    },
    Tuesday: {
      breakfast: ['Puri Bhaji', 'Keshari Bath', 'Tea / Coffee'],
      lunch: ['Veg Biryani', 'Raita', 'Mirchi Ka Salan', 'Papad'],
      dinner: ['Phulka', 'Mix Veg Curry', 'Yellow Dal', 'Rice', 'Ice Cream'],
    },
    Wednesday: {
      breakfast: ['Masala Dosa', 'Sambar', 'Chutney'],
      lunch: ['Curd Rice', 'Sambar Rice', 'Potato Fry'],
      dinner: ['Paratha', 'Chole Masala', 'Jeera Rice', 'Fruit Custard'],
    },
  };

  const currentMenu = menus[selectedDay] || menus['Monday'];

  return (
    <AppShell role="STUDENT" userName="Rahul Sharma" roomDetails="Room B-204 · Block B">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <UtensilsCrossed className="w-6 h-6 text-amber-500" />
              Mess Hub & Dining Menu
            </h1>
            <p className="text-xs text-muted-foreground">Weekly meal schedule, allergen info & dining ratings</p>
          </div>
          <div className="flex items-center gap-1 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 text-xs font-bold text-amber-600 dark:text-amber-400">
            <Star className="w-4 h-4 fill-amber-500" />
            Hostel Mess Satisfaction: 4.2 / 5.0
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                selectedDay === day ? 'bg-primary text-primary-foreground shadow-xs' : 'bg-card text-muted-foreground hover:bg-muted'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Meal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Breakfast */}
          <Card className="border border-border">
            <CardHeader className="p-5 pb-3 border-b border-border">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Breakfast</CardTitle>
                <Badge variant="outline" className="text-[10px]">07:30 AM – 09:30 AM</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-2">
              {currentMenu.breakfast.map((item: string, i: number) => (
                <div key={i} className="p-2 rounded bg-muted/30 text-xs font-medium text-foreground">
                  • {item}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Lunch */}
          <Card className="border border-border">
            <CardHeader className="p-5 pb-3 border-b border-border">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Lunch</CardTitle>
                <Badge variant="outline" className="text-[10px]">12:30 PM – 02:30 PM</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-2">
              {currentMenu.lunch.map((item: string, i: number) => (
                <div key={i} className="p-2 rounded bg-muted/30 text-xs font-medium text-foreground">
                  • {item}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Dinner */}
          <Card className="border border-border">
            <CardHeader className="p-5 pb-3 border-b border-border">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Dinner</CardTitle>
                <Badge variant="outline" className="text-[10px]">07:30 PM – 09:30 PM</Badge>
              </div>
            </CardHeader>
            <CardContent className="p-5 space-y-2">
              {currentMenu.dinner.map((item: string, i: number) => (
                <div key={i} className="p-2 rounded bg-muted/30 text-xs font-medium text-foreground">
                  • {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Meal Rating Widget */}
        <Card className="border border-border bg-card">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-base">Rate Today's Meal</CardTitle>
            <CardDescription className="text-xs">Your feedback directly influences mess menu decisions</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-2">
            {ratingSubmitted ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Thank you! Your feedback has been recorded.
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex gap-1 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-6 h-6 fill-amber-400 cursor-pointer hover:scale-110 transition-transform" />
                  ))}
                </div>
                <Button onClick={() => setRatingSubmitted(true)} size="sm" className="text-xs">
                  Submit Rating
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
