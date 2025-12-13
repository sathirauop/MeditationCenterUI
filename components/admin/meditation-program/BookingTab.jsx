'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock, Sparkles } from 'lucide-react';

export default function BookingTab() {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Card className="max-w-lg text-center border-2 border-dashed border-teal-200 bg-gradient-to-br from-teal-50 to-white">
                <CardHeader className="pb-4">
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mb-4 shadow-md">
                        <CalendarClock className="w-10 h-10 text-teal-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Coming Soon
                        <Sparkles className="w-5 h-5 text-amber-500" />
                    </CardTitle>
                    <CardDescription className="text-base text-gray-600">
                        Booking Management System
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                        We&apos;re working on an amazing booking management feature that will allow you to:
                    </p>
                    <ul className="text-left text-gray-600 space-y-2 max-w-sm mx-auto">
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-1">•</span>
                            <span>View and manage participant registrations</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-1">•</span>
                            <span>Track seat availability in real-time</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-1">•</span>
                            <span>Send notifications to participants</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-teal-600 mt-1">•</span>
                            <span>Export booking reports</span>
                        </li>
                    </ul>
                    <div className="pt-4">
                        <span className="inline-flex items-center gap-2 text-sm font-medium text-teal-700 bg-teal-100 px-4 py-2 rounded-full">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                            </span>
                            Feature under development
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
