'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { usePublicGallery } from '@/lib/hooks/use-gallery';
import { Loader2, X, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';

export default function GalleryPage() {
    const { data: groups, isLoading, error } = usePublicGallery();
    const [lightbox, setLightbox] = useState(null); // { groupIndex, photoIndex }

    // All photos flattened for lightbox navigation
    const allPhotos = groups?.flatMap((group, gi) =>
        (group.photos || []).map((photo, pi) => ({
            ...photo,
            groupIndex: gi,
            photoIndex: pi,
            groupName: group.name,
        }))
    ) || [];

    const currentFlatIndex = lightbox
        ? allPhotos.findIndex(
            p => p.groupIndex === lightbox.groupIndex && p.photoIndex === lightbox.photoIndex
        )
        : -1;

    const openLightbox = (groupIndex, photoIndex) => {
        setLightbox({ groupIndex, photoIndex });
    };

    const closeLightbox = () => {
        setLightbox(null);
    };

    const goNext = useCallback(() => {
        if (currentFlatIndex < allPhotos.length - 1) {
            const next = allPhotos[currentFlatIndex + 1];
            setLightbox({ groupIndex: next.groupIndex, photoIndex: next.photoIndex });
        }
    }, [currentFlatIndex, allPhotos]);

    const goPrev = useCallback(() => {
        if (currentFlatIndex > 0) {
            const prev = allPhotos[currentFlatIndex - 1];
            setLightbox({ groupIndex: prev.groupIndex, photoIndex: prev.photoIndex });
        }
    }, [currentFlatIndex, allPhotos]);

    // Keyboard navigation
    useEffect(() => {
        if (!lightbox) return;
        const handleKey = (e) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') goNext();
            if (e.key === 'ArrowLeft') goPrev();
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [lightbox, goNext, goPrev]);

    // Prevent body scroll when lightbox open
    useEffect(() => {
        if (lightbox) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [lightbox]);

    const currentPhoto = lightbox ? allPhotos[currentFlatIndex] : null;

    // Generate placeholder gradient colors for photos
    const getGradient = (index) => {
        const gradients = [
            'from-teal-200 via-cyan-200 to-blue-200',
            'from-emerald-200 via-teal-200 to-cyan-200',
            'from-blue-200 via-indigo-200 to-purple-200',
            'from-amber-200 via-orange-200 to-red-200',
            'from-green-200 via-emerald-200 to-teal-200',
            'from-pink-200 via-rose-200 to-red-200',
            'from-violet-200 via-purple-200 to-fuchsia-200',
            'from-sky-200 via-blue-200 to-indigo-200',
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 pt-20">
                {/* Hero Section */}
                <section className="relative py-16 md:py-24 bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-900 text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }} />
                    </div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                            Photo Gallery
                        </h1>
                        <p className="text-lg md:text-xl text-teal-100 max-w-2xl mx-auto">
                            Moments of peace, mindfulness, and community captured at our meditation center
                        </p>
                    </div>
                </section>

                {/* Gallery Content */}
                <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
                    <div className="container mx-auto px-4">
                        {/* Loading */}
                        {isLoading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                            </div>
                        )}

                        {/* Error */}
                        {error && !isLoading && (
                            <div className="text-center py-20 text-gray-500">
                                <p>Unable to load gallery. Please try again later.</p>
                            </div>
                        )}

                        {/* Empty */}
                        {!isLoading && !error && (!groups || groups.length === 0) && (
                            <div className="text-center py-20">
                                <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">Gallery coming soon</p>
                            </div>
                        )}

                        {/* Gallery Groups */}
                        {!isLoading && !error && groups?.length > 0 && (
                            <div className="space-y-16">
                                {groups.map((group, groupIndex) => (
                                    <div key={group.group_id}>
                                        {/* Group Header */}
                                        <div className="mb-8 text-center">
                                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                                                {group.name}
                                            </h2>
                                            {group.name_si && (
                                                <p className="text-gray-500 text-lg">{group.name_si}</p>
                                            )}
                                            <div className="mt-3 w-16 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 mx-auto rounded-full" />
                                        </div>

                                        {/* Photos Grid - Masonry-like with varying sizes */}
                                        {(!group.photos || group.photos.length === 0) ? (
                                            <p className="text-center text-gray-400 py-8">No photos in this group yet</p>
                                        ) : (
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                                                {group.photos.map((photo, photoIndex) => {
                                                    // Make some photos span 2 columns for visual interest
                                                    const isLarge = photoIndex === 0 || (photoIndex % 7 === 0);
                                                    const globalIndex = allPhotos.findIndex(
                                                        p => p.groupIndex === groupIndex && p.photoIndex === photoIndex
                                                    );

                                                    return (
                                                        <div
                                                            key={photo.photo_id}
                                                            className={`
                                                                relative overflow-hidden rounded-xl cursor-pointer 
                                                                transition-all duration-300 hover:shadow-xl hover:scale-[1.02]
                                                                ${isLarge ? 'col-span-2 row-span-2' : ''}
                                                            `}
                                                            style={{ aspectRatio: isLarge ? '1' : '1' }}
                                                            onClick={() => openLightbox(groupIndex, photoIndex)}
                                                        >
                                                            {/* Gradient placeholder */}
                                                            <div className={`
                                                                w-full h-full bg-gradient-to-br ${getGradient(globalIndex)}
                                                                flex items-center justify-center
                                                            `}>
                                                                <ImageIcon className={`
                                                                    text-white/40
                                                                    ${isLarge ? 'h-12 w-12' : 'h-8 w-8'}
                                                                `} />
                                                            </div>

                                                            {/* Hover overlay */}
                                                            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-end">
                                                                {photo.caption && (
                                                                    <div className="w-full p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity">
                                                                        <p className="text-white text-sm">{photo.caption}</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />

            {/* Lightbox */}
            {lightbox && currentPhoto && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={closeLightbox}
                >
                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-50 text-white/70 hover:text-white transition-colors p-2"
                    >
                        <X className="h-8 w-8" />
                    </button>

                    {/* Navigation - Previous */}
                    {currentFlatIndex > 0 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); goPrev(); }}
                            className="absolute left-4 z-50 text-white/70 hover:text-white transition-colors p-2"
                        >
                            <ChevronLeft className="h-10 w-10" />
                        </button>
                    )}

                    {/* Photo */}
                    <div
                        className="max-w-4xl max-h-[85vh] mx-auto px-16"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={`
                            w-full aspect-square max-w-xl mx-auto rounded-lg overflow-hidden
                            bg-gradient-to-br ${getGradient(currentFlatIndex)}
                            flex items-center justify-center
                        `}>
                            <ImageIcon className="h-20 w-20 text-white/40" />
                        </div>

                        {/* Caption and group info */}
                        <div className="text-center mt-6">
                            {currentPhoto.caption && (
                                <p className="text-white text-lg mb-2">{currentPhoto.caption}</p>
                            )}
                            <p className="text-white/50 text-sm">
                                {currentPhoto.groupName} · {currentFlatIndex + 1} of {allPhotos.length}
                            </p>
                        </div>
                    </div>

                    {/* Navigation - Next */}
                    {currentFlatIndex < allPhotos.length - 1 && (
                        <button
                            onClick={(e) => { e.stopPropagation(); goNext(); }}
                            className="absolute right-4 z-50 text-white/70 hover:text-white transition-colors p-2"
                        >
                            <ChevronRight className="h-10 w-10" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
