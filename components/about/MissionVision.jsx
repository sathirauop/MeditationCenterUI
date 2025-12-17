'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

/**
 * MissionVision Component
 * Displays the mission and vision statement
 */
export default function MissionVision() {
    const t = useTranslations('About');

    return (
        <section className="py-16 sm:py-24">
            <div className="flex flex-col items-center text-center">
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                    {t('missionTitle')}
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
                    {t('missionDescription')}
                </p>
            </div>
        </section>
    );
}

