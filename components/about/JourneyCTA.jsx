import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * JourneyCTA Component
 * Call-to-action section encouraging users to explore programs
 */
export default function JourneyCTA() {
    return (
        <section className="py-16 sm:py-24">
            <div className="flex flex-col items-center justify-between gap-8 rounded-xl bg-blue-900/10 px-8 py-12 text-center md:flex-row md:text-left">
                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold text-gray-900">
                        Begin Your Journey With Us
                    </h3>
                    <p className="max-w-md text-gray-600">
                        Explore our upcoming retreats and programs designed to deepen your practice and cultivate inner peace.
                    </p>
                </div>
                <Link href="/programs">
                    <Button className="h-12 px-6 bg-blue-900 hover:bg-blue-800 text-white text-base font-bold shrink-0">
                        View Our Programs
                    </Button>
                </Link>
            </div>
        </section>
    );
}
