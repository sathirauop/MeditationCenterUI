'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getOverrides } from '@/lib/api/schedule';
import DateScheduleEditor from './DateScheduleEditor';
import 'react-calendar/dist/Calendar.css';

export default function ScheduleCalendar() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [overrideDates, setOverrideDates] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    // Fetch overrides to mark dates on calendar
    const fetchOverrides = async () => {
        try {
            setLoading(true);
            const data = await getOverrides();
            const dates = (data.data || []).map(o => o.override_date);
            setOverrideDates(dates);
        } catch (error) {
            console.error('Failed to fetch overrides:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOverrides();
    }, []);

    const handleDateClick = (date) => {
        setSelectedDate(date);
    };

    const handleBack = () => {
        setSelectedDate(null);
        fetchOverrides();
    };

    // Check if a date has an override
    const hasOverride = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return overrideDates.includes(dateStr);
    };

    // Custom tile content for calendar
    const tileContent = ({ date, view }) => {
        if (view === 'month' && hasOverride(date)) {
            return (
                <div className="flex justify-center mt-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                </div>
            );
        }
        return null;
    };

    // Custom tile class for today
    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            if (isToday) {
                return 'bg-amber-100 font-bold rounded-lg';
            }
            if (hasOverride(date)) {
                return 'bg-teal-50 rounded-lg';
            }
        }
        return '';
    };

    // Show date editor if date is selected
    if (selectedDate) {
        return (
            <DateScheduleEditor
                date={selectedDate}
                onBack={handleBack}
            />
        );
    }

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500" />
                    <span>Has Override</span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2 px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Today</span>
                </Badge>
            </div>

            <div className="bg-white rounded-lg border p-6 max-w-md">
                <style jsx global>{`
                    .react-calendar {
                        width: 100%;
                        border: none;
                        font-family: inherit;
                    }
                    .react-calendar__tile {
                        padding: 1em 0.5em;
                        position: relative;
                    }
                    .react-calendar__tile--active {
                        background: #14b8a6 !important;
                        color: white;
                        border-radius: 8px;
                    }
                    .react-calendar__tile--now {
                        background: #fef3c7 !important;
                        border-radius: 8px;
                    }
                    .react-calendar__tile:hover {
                        background: #e0f2f1 !important;
                        border-radius: 8px;
                    }
                    .react-calendar__navigation button {
                        font-size: 1rem;
                        font-weight: 600;
                    }
                    .react-calendar__navigation button:hover {
                        background: #e0f2f1;
                        border-radius: 8px;
                    }
                    .react-calendar__month-view__weekdays {
                        font-weight: 600;
                        color: #6b7280;
                        text-transform: uppercase;
                        font-size: 0.75rem;
                    }
                `}</style>
                <Calendar
                    onChange={handleDateClick}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    locale="en-US"
                />
            </div>

            <div className="text-sm text-gray-500">
                <p>Click on a date to view or edit the schedule for that day.</p>
                <p>Dates with a <span className="text-teal-600 font-medium">teal dot</span> have customized schedules.</p>
            </div>
        </div>
    );
}
