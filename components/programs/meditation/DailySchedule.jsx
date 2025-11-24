'use client';

import { Clock, Sun, Moon, Coffee } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const scheduleItems = [
    {
        time: '06:00 AM',
        title: 'Morning Chanting & Meditation',
        description: 'Start your day with traditional Pali chanting followed by guided mindfulness meditation.',
        icon: Sun,
        type: 'practice'
    },
    {
        time: '07:30 AM',
        title: 'Breakfast & Mindful Eating',
        description: 'Enjoy a nutritious vegetarian breakfast while practicing mindfulness in eating.',
        icon: Coffee,
        type: 'break'
    },
    {
        time: '09:00 AM',
        title: 'Dhamma Talk & Discussion',
        description: 'Listen to insightful teachings on Buddhist philosophy and its application in daily life.',
        icon: Moon, // Using Moon as a placeholder for "Talk/Wisdom" generic icon if needed, or maybe Book
        type: 'learning'
    },
    {
        time: '10:30 AM',
        title: 'Walking Meditation',
        description: 'Practice mindfulness in motion in our serene garden pathways.',
        icon: Sun,
        type: 'practice'
    },
    {
        time: '11:30 AM',
        title: 'Lunch (Dana)',
        description: 'Main meal of the day offered by devotees.',
        icon: Coffee,
        type: 'break'
    },
    {
        time: '02:00 PM',
        title: 'Afternoon Meditation',
        description: 'Intensive meditation session focusing on Vipassana (Insight) techniques.',
        icon: Sun,
        type: 'practice'
    },
    {
        time: '06:00 PM',
        title: 'Evening Chanting & Meditation',
        description: 'Closing the day with gratitude and reflection.',
        icon: Moon,
        type: 'practice'
    }
];

export default function DailySchedule() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Daily Schedule</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Our daily routine is carefully designed to balance meditation practice, learning, and rest.
                        This schedule helps maintain a focused and peaceful mind throughout the day.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-px bg-primary/20 md:-translate-x-1/2"></div>

                    <div className="space-y-12">
                        {scheduleItems.map((item, index) => (
                            <div key={index} className={`relative flex flex-col md:flex-row items-start ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>

                                {/* Timeline Dot */}
                                <div className="absolute left-[20px] md:left-1/2 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background shadow-sm z-10 md:-translate-x-1/2 mt-1.5"></div>

                                {/* Time (Mobile: Right of dot, Desktop: Opposite side of content) */}
                                <div className={`md:w-1/2 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:pl-12 text-left' : 'md:pr-12 md:text-right'} mb-2 md:mb-0`}>
                                    <span className="inline-flex items-center gap-2 text-primary font-bold text-lg bg-primary/5 px-3 py-1 rounded-full">
                                        <Clock className="w-4 h4" />
                                        {item.time}
                                    </span>
                                </div>

                                {/* Content Card */}
                                <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                                    <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`p-3 rounded-lg ${item.type === 'break' ? 'bg-orange-100 text-orange-600' : 'bg-primary/10 text-primary'}`}>
                                                    <item.icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
