import { formatDate, formatTimeRange } from '@/lib/utils/date-utils';
import { Calendar, Clock, MapPin } from 'lucide-react';

/**
 * EventDetailsCard Component
 * Displays quick event information in a horizontal layout
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-gray-200">
            {infoItems.map((item, index) => {
                const Icon = item.icon;
                return (
                    <div key={index} className="flex items-start gap-4">
                        <Icon className="text-blue-900 text-2xl mt-1 w-6 h-6 flex-shrink-0" />
                        <div>
                            <p className="text-gray-500 text-sm font-normal leading-normal mb-1">
                                {item.label}
                            </p>
                            <p className="text-gray-900 text-base font-medium leading-normal">
                                {item.value}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
