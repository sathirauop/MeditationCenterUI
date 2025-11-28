import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

/**
 * AboutHero Component
 * Hero section for the About page with background image and CTA
 */
export default function AboutHero() {
    return (
        <div className="p-4">
            <div
                className="flex min-h-[480px] flex-col items-center justify-center gap-6 rounded-xl bg-cover bg-center bg-no-repeat p-8 text-center sm:gap-8"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url('/images/temple2.webp')`
                }}
            >
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                        About Isipathana
                    </h1>
                    <p className="max-w-xl text-base font-normal leading-normal text-gray-200 sm:text-lg">
                        A sanctuary for cultivating mindfulness, wisdom, and compassion in the modern world.
                    </p>
                </div>
                <Link href="/programs">
                    <Button className="h-10 px-4 sm:h-12 sm:px-5 bg-blue-900 hover:bg-blue-800 text-white text-sm sm:text-base font-bold">
                        Explore Our Programs
                    </Button>
                </Link>
            </div>
        </div>
    );
}
