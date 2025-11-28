'use client';

import { Clock } from 'lucide-react';

const scheduleItems = [
    {
        time: '06:00 AM',
        title: 'Morning Chanting & Meditation',
        color: 'text-orange-600'
    },
    {
        time: '08:00 AM',
        title: 'Breakfast & Mindful Eating (Current)',
        color: 'text-orange-600'
    },
    {
        time: '10:30 AM',
        title: 'Dharma Talk & Discussion',
        color: 'text-blue-900'
    },
    {
        time: '11:30 AM',
        title: 'Walking Meditation',
        color: 'text-blue-900'
    },
    {
        time: '02:00 PM',
        title: 'Lunch (Dana)',
        color: 'text-blue-900'
    },
    {
        time: '06:00 PM',
        title: 'Evening Chanting & Meditation',
        color: 'text-blue-900'
    }
];

export default function DailySchedule() {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-blue-900">Daily Schedule</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Our daily routine is carefully designed to balance meditation practice, learning, and rest. This structure helps you deepen your practice and find peace throughout the day.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {scheduleItems.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start gap-3">
                                <div className="w-2 h-2 rounded-full bg-orange-600 mt-2 shrink-0"></div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-orange-600" />
                                        <span className={`font-bold ${item.color}`}>
                                            {item.time}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
