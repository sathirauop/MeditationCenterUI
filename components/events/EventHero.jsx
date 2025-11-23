import Image from 'next/image';
import { formatDate } from '@/lib/utils/date-utils';
import { Calendar } from 'lucide-react';

/**
 * EventHero Component
 * Displays the hero section with cover image and event title
 * 
 * @param {Object} event - Event data
 */
export default function EventHero({ event }) {
    const { name, event_date, cover_image_url } = event;

    return (
        <section className="relative h-[75vh] min-h-[500px] flex items-end overflow-hidden">
            {/* Cover Image */}
            <div className="absolute inset-0 z-0">
                {cover_image_url ? (
                    <Image
                        src={cover_image_url}
                        alt={name}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/70" />
            </div>

            {/* Decorative Orbs */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] opacity-40" />
            <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-orange-400/20 rounded-full blur-[80px] opacity-30" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-16 md:pb-20">
                <div className="max-w-4xl">
                    {/* Event Title */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        {name}
                    </h1>

                    {/* Date Badge */}
                    <div className="inline-flex items-center gap-3 bg-primary/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg">
                        <Calendar className="w-5 h-5 text-white" />
                        <span className="text-white font-semibold text-lg">
                            {formatDate(event_date)}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
