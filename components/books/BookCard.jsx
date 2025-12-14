'use client';

import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * BookCard Component
 * Vertical card for displaying books - compact version
 */
export default function BookCard({ book }) {
    const { title, author, description, pdf_url, cover_image_url } = book;

    const handleDownload = () => {
        if (pdf_url) {
            window.open(pdf_url, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Cover Image - Reduced height */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-primary/10 to-primary/20 overflow-hidden">
                {cover_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={cover_image_url}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <FileText className="h-14 w-14 text-primary/30" />
                    </div>
                )}
            </div>

            {/* Content - More compact */}
            <div className="p-3 space-y-2">
                {/* Title */}
                <h3 className="font-semibold text-base text-gray-900 line-clamp-2 min-h-[2.5rem]">
                    {title}
                </h3>

                {/* Author */}
                {author && (
                    <p className="text-sm text-primary font-medium">
                        by {author}
                    </p>
                )}

                {/* Description */}
                {description && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Download Button */}
                <Button
                    onClick={handleDownload}
                    disabled={!pdf_url}
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                </Button>
            </div>
        </div>
    );
}
