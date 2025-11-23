'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

/**
 * EventGallery Component
 * Displays event gallery images in a responsive grid with lightbox
 * 
 * @param {Array} images - Array of gallery image URLs
 */
export default function EventGallery({ images }) {
    const [selectedImage, setSelectedImage] = useState(null);

    // Convert Set to Array if needed
    const imageArray = Array.isArray(images) ? images : Array.from(images || []);

    if (!imageArray || imageArray.length === 0) {
        return null;
    }

    return (
        <>
            <section className="py-20 bg-muted/20 relative overflow-hidden">
                {/* Decorative Orb */}
                <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-orange-400/20 rounded-full blur-[100px] opacity-30 pointer-events-none" />

                <div className="container mx-auto px-6 max-w-7xl relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Event Gallery</h2>
                        <p className="text-lg text-muted-foreground">
                            Explore moments from our meditation center
                        </p>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imageArray.map((imageUrl, index) => (
                            <div
                                key={index}
                                className="relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer group"
                                onClick={() => setSelectedImage(imageUrl)}
                            >
                                <Image
                                    src={imageUrl}
                                    alt={`Gallery image ${index + 1}`}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    {/* Close Button */}
                    <button
                        className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-colors"
                        onClick={() => setSelectedImage(null)}
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Image */}
                    <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                        <Image
                            src={selectedImage}
                            alt="Gallery image"
                            fill
                            className="object-contain"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
