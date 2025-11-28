import React from 'react';
import { Button } from '@/components/ui/button';

/**
 * OurStory Component
 * Displays the center's story with text and image
 */
export default function OurStory() {
    return (
        <section className="py-16 sm:py-24">
            <div className="flex flex-col items-stretch gap-8 rounded-xl md:flex-row lg:gap-12">
                <div className="flex flex-1 flex-col justify-center gap-4">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-3xl font-bold leading-tight text-gray-900">
                            Our Story
                        </h2>
                        <p className="text-base leading-relaxed text-gray-600">
                            Isipathana International Meditation Center was founded with the vision of creating a peaceful refuge for individuals seeking to explore the depths of their own minds. Our journey began with a small group of dedicated practitioners, and has since grown into a global community united by a shared commitment to inner peace and awakening.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="w-fit h-10 px-4 bg-blue-900/10 text-blue-900 hover:bg-blue-900/20 border-0"
                    >
                        Read More
                    </Button>
                </div>
                <div
                    className="w-full aspect-[4/3] rounded-xl bg-cover bg-center bg-no-repeat md:flex-1"
                    style={{
                        backgroundImage: `url('/images/meditationHall.jpeg')`
                    }}
                />
            </div>
        </section>
    );
}
