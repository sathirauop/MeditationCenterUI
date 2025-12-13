'use client';

import Image from 'next/image';

export default function ProgramGallery({ images: propImages }) {
    const defaultImages = [
        { src: '/images/temple2.webp', alt: 'Meditation Hall' },
        { src: '/images/meditationHall.jpeg', alt: 'Group Meditation' },
        { src: '/images/temple2.webp', alt: 'Garden Walk' },
        { src: '/images/meditationHall.jpeg', alt: 'Evening Chanting' },
    ];

    const images = (propImages && propImages.length > 0)
        ? propImages.map((src, i) => ({ src, alt: `Gallery Image ${i + 1}` }))
        : defaultImages;

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 text-blue-900">Life at the Center</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Glimpses of the peaceful atmosphere and daily activities at our meditation center.
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="relative h-64 rounded-lg overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500"
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
