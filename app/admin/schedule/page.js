'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Calendar, CalendarDays, Eye } from 'lucide-react';
import ActivityList from '@/components/admin/activities/ActivityList';
import TemplateList from '@/components/admin/schedule/TemplateList';
import ScheduleCalendar from '@/components/admin/schedule/ScheduleCalendar';
import SchedulePreview from '@/components/admin/schedule/SchedulePreview';

export default function SchedulePage() {
    const [activeTab, setActiveTab] = useState('activities');

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Daily Schedule</h1>
                <p className="text-muted-foreground mt-1">
                    Manage activities, templates, and daily schedules
                </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid bg-gray-100">
                    <TabsTrigger value="activities" className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                        <BookOpen className="w-4 h-4" />
                        <span className="hidden sm:inline">Activities</span>
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                        <Calendar className="w-4 h-4" />
                        <span className="hidden sm:inline">Templates</span>
                    </TabsTrigger>
                    <TabsTrigger value="schedule" className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                        <CalendarDays className="w-4 h-4" />
                        <span className="hidden sm:inline">Schedule</span>
                    </TabsTrigger>
                    <TabsTrigger value="preview" className="flex items-center gap-2 data-[state=active]:bg-teal-600 data-[state=active]:text-white">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Preview</span>
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="activities" className="mt-6">
                    <ActivityList />
                </TabsContent>

                <TabsContent value="templates" className="mt-6">
                    <TemplateList />
                </TabsContent>

                <TabsContent value="schedule" className="mt-6">
                    <ScheduleCalendar />
                </TabsContent>

                <TabsContent value="preview" className="mt-6">
                    <SchedulePreview />
                </TabsContent>
            </Tabs>
        </div>
    );
}
