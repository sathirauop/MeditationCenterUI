'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, CalendarCheck, CalendarDays } from 'lucide-react';
import GeneralTab from '@/components/admin/meditation-program/GeneralTab';
import BookingTab from '@/components/admin/meditation-program/BookingTab';
import DailyScheduleTab from '@/components/admin/meditation-program/DailyScheduleTab';

export default function MeditationProgramPage() {
    const [activeTab, setActiveTab] = useState('general');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meditation Program</h1>
                <p className="text-muted-foreground mt-1">
                    Manage your meditation program details, bookings, and daily schedule
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid bg-gray-100">
                    <TabsTrigger
                        value="general"
                        className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="hidden sm:inline">General</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="booking"
                        className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                    >
                        <CalendarCheck className="w-4 h-4" />
                        <span className="hidden sm:inline">Booking</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="daily-schedule"
                        className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white"
                    >
                        <CalendarDays className="w-4 h-4" />
                        <span className="hidden sm:inline">Daily Schedule</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="mt-6">
                    <GeneralTab />
                </TabsContent>

                <TabsContent value="booking" className="mt-6">
                    <BookingTab />
                </TabsContent>

                <TabsContent value="daily-schedule" className="mt-6">
                    <DailyScheduleTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
