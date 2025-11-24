'use client';

import Image from 'next/image';

const images = [
    { src: '/images/temple2.webp', alt: 'Meditation Hall' },
    { src: '/images/meditationHall.jpeg', alt: 'Group Meditation' },
    // Using placeholders for now as we might not have enough real images
    { src: '/images/temple2.webp', alt: 'Garden Walk' },
    { src: '/images/meditationHall.jpeg', alt: 'Evening Chanting' },
    { src: '/images/temple2.webp', alt: 'Peaceful Surroundings' },
    { src: '/images/meditationHall.jpeg', alt: 'Community' },
];

export default function ProgramGallery() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4">Life at the Center</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Glimpses of the peaceful atmosphere and daily activities at our meditation center.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {images.map((img, index) => (
                        <div
                            key={index}
                            className="relative h-80 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-all duration-500"
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                <p className="text-white font-medium text-lg">{img.alt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
