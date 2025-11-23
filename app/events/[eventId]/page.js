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
        <div className="min-h-screen">
            <Header />

            {/* Back Button - Fixed Position */}
            <button
                onClick={() => router.back()}
                className="fixed top-24 left-6 z-50 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 font-semibold hover:bg-white"
            >
                <ArrowLeft className="w-4 h-4" />
                Back
            </button>

            {/* Hero Section */}
            <EventHero event={event} />

            {/* Event Details Section */}
            <section className="py-20 bg-background">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start">
                        {/* Left: Quick Info Card */}
                        <EventDetailsCard event={event} />

                        {/* Right: Description */}
                        <EventDescription event={event} />
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            {event.gallery_image_urls && event.gallery_image_urls.length > 0 && (
                <EventGallery images={event.gallery_image_urls} />
            )}

            <Footer />
        </div>
    );
}
