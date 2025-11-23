import { formatDate, formatTimeRange } from '@/lib/utils/date-utils';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/card';

/**
 * EventDetailsCard Component
 * Displays quick event information in a sticky card
 * 
 * @param {Object} event - Event data
 */
export default function EventDetailsCard({ event }) {
    const { event_date, start_time, end_time, location } = event;

    const infoItems = [
        {
            icon: Calendar,
            label: 'Date',
            value: formatDate(event_date),
        },
        {
            icon: Clock,
            label: 'Time',
            value: formatTimeRange(start_time, end_time),
        },
        {
            icon: MapPin,
            label: 'Location',
            value: location,
        },
    ];

    return (
        <Card className="bg-muted/30 border-2 rounded-2xl p-8 sticky top-24 shadow-lg">
            <div className="space-y-6">
                {infoItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={index}
                            className="flex gap-4 pb-6 border-b border-border last:border-b-0 last:pb-0"
                        >
                            {/* Icon */}
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-primary" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-1">
                                    {item.label}
                                </div>
                                <div className="text-base font-medium text-foreground break-words">
                                    {item.value}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
