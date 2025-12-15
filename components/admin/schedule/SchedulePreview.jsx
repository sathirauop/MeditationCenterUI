'use client';

import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import { Loader2, Clock, XCircle, Printer, Share2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useSchedulePreview } from '@/lib/hooks/use-schedule';
import { cn } from '@/lib/utils';
import { formatDateToISO } from '@/lib/utils/date-utils';
import 'react-calendar/dist/Calendar.css';

export default function SchedulePreview() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { toast } = useToast();

    const dateStr = useMemo(() => {
        return formatDateToISO(selectedDate);
    }, [selectedDate]);

    const formattedDate = useMemo(() => {
        return selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }, [selectedDate]);

    // React Query Hook
    const { data: schedule, isLoading: loading, error } = useSchedulePreview(dateStr);

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        try {
            const shareUrl = `${window.location.origin}/schedule?date=${dateStr}`;
            await navigator.clipboard.writeText(shareUrl);
            toast({ title: "Link Copied", description: "Schedule link copied to clipboard" });
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: "Failed to copy link" });
        }
    };

    return (
        <div className="space-y-6">
            {/* Date Picker and Actions */}
            <div className="flex flex-col md:flex-row gap-6">
                {/* Calendar */}
                <div className="bg-white rounded-lg border p-4 w-full md:w-auto">
                    <style jsx global>{`
                        .preview-calendar .react-calendar {
                            width: 280px;
                            border: none;
                            font-family: inherit;
                        }
                        .preview-calendar .react-calendar__tile {
                            padding: 0.75em 0.5em;
                        }
                        .preview-calendar .react-calendar__tile--active {
                            background: #14b8a6 !important;
                            color: white;
                            border-radius: 8px;
                        }
                        .preview-calendar .react-calendar__tile:hover {
                            background: #e0f2f1 !important;
                            border-radius: 8px;
                        }
                    `}</style>
                    <div className="preview-calendar">
                        <Calendar
                            value={selectedDate}
                            onChange={setSelectedDate}
                            locale="en-US"
                        />
                    </div>
                </div>

                {/* Schedule Preview */}
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{formattedDate}</h3>
                            {schedule && (
                                <div className="mt-1">
                                    {schedule.is_override ? (
                                        <Badge className="bg-teal-100 text-teal-800 border-teal-200">
                                            Override Schedule
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-gray-600">
                                            Default Template
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handlePrint}>
                                <Printer className="w-4 h-4 mr-2" />
                                Print
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleShare}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 text-red-500 border-2 border-dashed rounded-lg border-red-200 bg-red-50">
                            <p>Failed to load schedule</p>
                        </div>
                    ) : !schedule || !schedule.activities || schedule.activities.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400 border-2 border-dashed rounded-lg">
                            <Clock className="w-12 h-12 mb-3 opacity-50" />
                            <p>No schedule defined for this date</p>
                        </div>
                    ) : (
                        <div className="space-y-3 bg-white rounded-lg border p-4">
                            {schedule.activities.map((activity, idx) => (
                                <div
                                    key={activity.override_activity_id || activity.template_activity_id || idx}
                                    className={cn(
                                        "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                                        activity.is_cancelled
                                            ? "bg-red-50 border-red-200"
                                            : "bg-gray-50 hover:bg-teal-50"
                                    )}
                                >
                                    {/* Time */}
                                    <div className="flex flex-col items-center min-w-[80px]">
                                        <span className={cn(
                                            "text-lg font-bold",
                                            activity.is_cancelled ? "text-red-400" : "text-teal-600"
                                        )}>
                                            {activity.start_time}
                                        </span>
                                        <span className="text-xs text-gray-400">to</span>
                                        <span className={cn(
                                            "text-sm",
                                            activity.is_cancelled ? "text-red-400" : "text-gray-600"
                                        )}>
                                            {activity.end_time}
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className={cn(
                                        "w-1 self-stretch rounded-full",
                                        activity.is_cancelled ? "bg-red-300" : "bg-teal-400"
                                    )} />

                                    {/* Content */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className={cn(
                                                "font-semibold text-lg",
                                                activity.is_cancelled && "line-through text-gray-400"
                                            )}>
                                                {activity.activity_title || activity.title}
                                            </h4>
                                            {activity.is_cancelled && (
                                                <Badge className="bg-red-100 text-red-700">
                                                    <XCircle className="w-3 h-3 mr-1" />
                                                    Cancelled
                                                </Badge>
                                            )}
                                        </div>
                                        {activity.description && (
                                            <p className={cn(
                                                "text-sm mt-1",
                                                activity.is_cancelled ? "text-gray-400" : "text-gray-600"
                                            )}>
                                                {activity.description}
                                            </p>
                                        )}
                                        {activity.notes && (
                                            <p className="text-sm mt-2 text-amber-600 italic">
                                                Note: {activity.notes}
                                            </p>
                                        )}
                                    </div>

                                    {/* Media Thumbnail */}
                                    {activity.media_url && !activity.is_cancelled && (
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={activity.media_url}
                                                alt={activity.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
