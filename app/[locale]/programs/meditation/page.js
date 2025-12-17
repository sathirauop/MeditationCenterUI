'use client';

import { usePublicActiveProgram } from '@/lib/hooks/use-programs';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProgramHero from '@/components/programs/meditation/ProgramHero';
import DailySchedule from '@/components/programs/meditation/DailySchedule';
import BookingWidget from '@/components/programs/meditation/BookingWidget';
import ProgramGallery from '@/components/programs/meditation/ProgramGallery';
import { Loader2 } from 'lucide-react';

export default function Page() {
    const { data: program, isLoading, error } = usePublicActiveProgram();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 className="w-12 h-12 animate-spin text-blue-900" />
            </div>
        );
    }

    // Handle 404 specifically if needed, or general error
    if (error) {
        // If 404 (No active program), distinct UI? 
        // For now, show generic error or "No active program"
        const isNotFound = error?.status === 404;

        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {isNotFound ? 'No Active Program' : 'Unable to Load Program'}
                    </h1>
                    <p className="text-gray-600">
                        {isNotFound
                            ? 'The meditation program is currently not scheduled. Please check back later.'
                            : 'There was an error loading the program details. Please try again later.'}
                    </p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <ProgramHero
                    title={program?.name}
                    description={program?.description}
                    coverImage={program?.cover_image_url}
                />
                <DailySchedule />
                <ProgramGallery images={program?.gallery_image_urls} />
                <BookingWidget maxSeats={program?.max_seats} />
            </main>
            <Footer />
        </div>
    );
}

