'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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
            <section className="py-12 bg-white">
                <div className="container mx-auto px-6 sm:px-10 max-w-[960px]">
                    {/* Section Header */}
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-blue-900 text-3xl font-bold leading-tight">Event Gallery</h2>
                        <div className="flex gap-2">
                            <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-blue-900/10 hover:text-blue-900 hover:border-blue-900 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-gray-600 hover:bg-blue-900/10 hover:text-blue-900 hover:border-blue-900 transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {imageArray.slice(0, 4).map((imageUrl, index) => (
                            <div
                                key={index}
                                className="aspect-square w-full bg-center bg-no-repeat bg-cover rounded-lg overflow-hidden cursor-pointer group"
                                onClick={() => setSelectedImage(imageUrl)}
                            >
                                <Image
                                    src={imageUrl}
                                    alt={`Gallery image ${index + 1}`}
                                    width={300}
                                    height={300}
                                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                />
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
