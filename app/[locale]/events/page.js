'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventCard from '@/components/events/EventCard';
import { useEvents } from '@/lib/hooks/use-events';
import { Loader2, AlertCircle } from 'lucide-react';

export default function EventsPage() {
    // Fetch events
    // Using a higher limit to show more events on the dedicated page
    const { data: eventsData, isLoading, error } = useEvents({ limit: 12, offset: 0 });
    const events = Array.isArray(eventsData) ? eventsData : [];

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-grow pt-32 pb-16">
                <div className="container mx-auto px-6">
                    {/* Page Header */}
                    <div className="max-w-3xl mx-auto text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                            Upcoming Events
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                            Discover our upcoming meditation sessions, spiritual workshops, and community gatherings.
                            Each event is designed to support your journey towards mindfulness, inner peace, and spiritual growth.
                            Join our community and participate in these transformative experiences.
                        </p>
                    </div>

                    {/* Events Grid */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            <span className="ml-3 text-muted-foreground">Loading events...</span>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <AlertCircle className="w-12 h-12 text-destructive mb-4" />
                            <p className="text-destructive font-medium mb-2">Failed to Load Events</p>
                            <p className="text-sm text-muted-foreground">{error?.message || 'An error occurred'}</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-muted/30 rounded-2xl">
                            <p className="text-muted-foreground text-lg">No upcoming events scheduled at the moment.</p>
                            <p className="text-sm text-muted-foreground mt-2">Please check back later for updates.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {events.map((event) => (
                                <EventCard key={event.event_id} event={event} />
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
