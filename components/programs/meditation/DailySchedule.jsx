'use client';

import { useTodaySchedule } from '@/lib/hooks/use-schedule';
import { Clock } from 'lucide-react';

const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const time = new Date();
    time.setHours(parseInt(hours, 10));
    time.setMinutes(parseInt(minutes, 10));
    return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const DUMMY_SCHEDULE = [
    {
        start_time: '06:00',
        activity_title: 'Morning Chanting & Meditation'
    },
    {
        start_time: '08:00',
        activity_title: 'Breakfast & Mindful Eating'
    },
    {
        start_time: '10:30',
        activity_title: 'Dharma Talk & Discussion'
    },
    {
        start_time: '11:30',
        activity_title: 'Walking Meditation'
    },
    {
        start_time: '14:00',
        activity_title: 'Lunch (Dana)'
    },
    {
        start_time: '18:00',
        activity_title: 'Evening Chanting & Meditation'
    }
];

export default function DailySchedule() {
    const { data: schedule, isLoading, error } = useTodaySchedule();

    // Fallback to dummy data if loading or error (simulating current behavior until backend is ready)
    // or if we decide to show skeleton, we can do that. For now, let's just handle "no data" gracefully.
    // Given the prompt, we should use the API data.

    // Using a stable color rotation since the API doesn't provide colors
    const getItemColor = (index) => index % 2 === 0 ? 'text-orange-600' : 'text-blue-900';

    const activities = schedule?.activities || DUMMY_SCHEDULE;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-blue-900">
                        Daily Schedule
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our daily routine is carefully designed to balance meditation practice, learning, and rest. This structure helps you deepen your practice and find peace throughout the day.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    <div className="relative border-l-2 border-blue-100 ml-4 md:ml-6 space-y-4 my-8">
                        {activities.map((item, index) => (
                            <div key={item.activity_id || index} className="relative ml-8 md:ml-12">
                                {/* Timeline wrapper for Dot */}
                                <span className="absolute -left-[42px] md:-left-[58px] top-5 flex items-center justify-center w-6 h-6 rounded-full bg-white ring-8 ring-white">
                                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                </span>

                                <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            <span className="text-lg font-bold text-blue-900">
                                                {formatTime(item.start_time)}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                        {item.activity_title}
                                    </h3>

                                    {item.activity_description && (
                                        <p className="text-gray-600 mb-2 text-sm leading-relaxed">
                                            {item.activity_description}
                                        </p>
                                    )}

                                    {item.notes && (
                                        <div className="mt-2 text-xs text-gray-500 italic bg-white/50 p-2 rounded border border-gray-100">
                                            <span className="font-semibold block text-[10px] uppercase tracking-wider text-blue-600 mb-0.5 not-italic">Update</span>
                                            {item.notes}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Debug info - remove in production
                <div className="mt-4 text-center text-xs text-gray-300">
                     {isLoading ? 'Loading fresh schedule...' : 'Schedule loaded'}
                </div>
                */}
            </div>
        </section>
    );
}
