'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function ProgramHero() {
    return (
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/temple2.webp" // Using existing image for now
                    alt="Meditation Environment"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    className="scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center text-white">
                <span className="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-sm text-sm font-medium mb-6 tracking-wider uppercase">
                    Transform Your Life
                </span>
                <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                    Meditation Programs
                </h1>
                <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto text-gray-200 leading-relaxed">
                    Discover inner peace through our guided meditation sessions. Whether you are a beginner or an experienced practitioner, our programs are designed to help you cultivate mindfulness, reduce stress, and find balance in your daily life.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg w-full sm:w-auto">
                        Book a Session
                    </Button>
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black px-8 py-6 text-lg w-full sm:w-auto">
                        View Schedule
                    </Button>
                </div>

                {/* Stats or Highlights */}
                <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/10 pt-8 max-w-4xl mx-auto">
                    <div>
                        <p className="text-3xl font-bold text-primary">Daily</p>
                        <p className="text-sm text-gray-300">Sessions</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-primary">Expert</p>
                        <p className="text-sm text-gray-300">Guidance</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-primary">Peaceful</p>
                        <p className="text-sm text-gray-300">Environment</p>
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-primary">Free</p>
                        <p className="text-sm text-gray-300">Participation</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
