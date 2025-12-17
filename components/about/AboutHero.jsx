'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

/**
 * AboutHero Component
 * Hero section for the About page with background image and CTA
 */
export default function AboutHero() {
    const t = useTranslations('About');

    return (
        <div className="p-4">
            <div
                className="flex min-h-[480px] flex-col items-center justify-center gap-6 rounded-xl bg-cover bg-center bg-no-repeat p-8 text-center sm:gap-8"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%), url('/images/temple2.webp')`
                }}
            >
                <div className="flex flex-col gap-2">
                    <h1 className="text-white text-4xl font-black leading-tight tracking-tight sm:text-5xl">
                        {t('heroTitle')}
                    </h1>
                    <p className="max-w-xl text-base font-normal leading-normal text-gray-200 sm:text-lg">
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

