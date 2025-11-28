'use client';

import Image from 'next/image';

export default function ProgramHero() {
    return (
        <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/temple2.webp"
                    alt="Meditation Environment"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                />
                <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center text-white">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                    Meditation Programs
                </h1>
                <p className="text-base md:text-lg max-w-3xl mx-auto text-white/90 leading-relaxed">
                    Discover the path to inner peace and clarity through our immersive Vipassana meditation program. This program is designed to guide participants in the practice of mindfulness, helping to cultivate a deeper understanding of the mind and body. Suitable for both beginners and experienced practitioners, our retreat provides a supportive and tranquil environment for profound personal growth.
                </p>
            </div>
        </section>
    );
}
