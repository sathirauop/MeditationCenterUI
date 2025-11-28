'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEvent } from '@/lib/hooks/use-events';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import EventHero from '@/components/events/EventHero';
import EventDetailsCard from '@/components/events/EventDetailsCard';
import EventDescription from '@/components/events/EventDescription';
import EventGallery from '@/components/events/EventGallery';

/**
 * Event Details Page
 * Displays comprehensive information about a single event
 * Route: /events/[eventId]
 */
export default function EventDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.eventId;

    // Fetch event data using the useEvent hook
    const { data: event, isLoading, error } = useEvent(eventId);

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                        <p className="text-muted-foreground">Loading event details...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Error state
    if (error || !event) {
        return (
            <div className="min-h-screen">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-6">
                    <AlertCircle className="w-16 h-16 text-destructive mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
                    <p className="text-muted-foreground mb-6 text-center max-w-md">
                        {error?.message || 'The event you are looking for does not exist or has been removed.'}
                    </p>
                    <Button onClick={() => router.push('/')} variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header />

            {/* Hero Section */}
            <EventHero event={event} />

            {/* Main Content */}
            <main className="flex-1 px-6 sm:px-10 py-8">
                <div className="container mx-auto max-w-[960px]">
                    {/* Event Title and Description */}
                    <div className="flex flex-col gap-6 pt-2 pb-12">
                        <h1 className="text-blue-900 text-4xl md:text-5xl font-black leading-tight tracking-tight">
                            {event.name}
                        </h1>
                        <p className="text-gray-700 text-base font-normal leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    {/* Event Details - Horizontal Layout */}
                    <EventDetailsCard event={event} />
                </div>
            </main>

            {/* Gallery Section */}
            {event.gallery_image_urls && event.gallery_image_urls.length > 0 && (
                <EventGallery images={event.gallery_image_urls} />
            )}

            <Footer />
        </div>
    );
}
