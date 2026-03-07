'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

/**
 * AboutHero Component
 * Hero section for the About page with background image and CTA
 * Styled consistently with ProgramHero
 */
export default function AboutHero() {
    const t = useTranslations('About');

    return (
        <div className="relative h-[60vh] rounded-2xl overflow-hidden">
            {/* Background Image */}
            <Image
                src="/images/temple2.webp"
                alt={t('heroTitle')}
                fill
                style={{ objectFit: 'cover' }}
                priority
            />
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col items-center justify-center gap-6 px-6 text-center text-white">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                        {t('heroTitle')}
                    </h1>
                    <p className="text-base md:text-lg text-white/90 leading-relaxed">
                        {t('heroSubtitle')}
                    </p>
                </div>
                <Link href="/programs">
                    <Button className="h-10 px-4 sm:h-12 sm:px-5 bg-blue-900 hover:bg-blue-800 text-white text-sm sm:text-base font-bold">
                        {t('explorePrograms')}
                    </Button>
                </Link>
            </div>
        </div>
    );
}

