'use client';

import Image from 'next/image';

export default function ProgramHero({ title, description, coverImage }) {
    return (
        <section className="relative pt-20 bg-white">
            {/* Hero Container with rounded image */}
            <div className="container mx-auto px-6 py-8">
                <div className="relative h-[60vh] rounded-2xl overflow-hidden">
                    {/* Background Image */}
                    <Image
                        src={coverImage || "/images/temple2.webp"}
                        alt={title || "Meditation Environment"}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority
                    />
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center justify-center px-6 text-center text-white">
                        <div className="max-w-3xl">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                {title || "Meditation Programs"}
                            </h1>
                            <p className="text-base md:text-lg text-white/90 leading-relaxed">
                                {description || "Discover the path to inner peace and clarity through our immersive Vipassana meditation program. This program is designed to guide participants in the practice of mindfulness, helping to cultivate a deeper understanding of the mind and body. Suitable for both beginners and experienced practitioners, our retreat provides a supportive and tranquil environment for profound personal growth."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
