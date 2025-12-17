'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

/**
 * OurTeachers Component
 * Displays the meditation center's teachers in a grid
 */
export default function OurTeachers() {
    const t = useTranslations('About');

    const teachers = [
        {
            name: 'Anagarika Sharma',
            roleKey: 'residentTeacher',
            image: '/images/temple1.jpg',
        },
        {
            name: 'Kenji Tanaka',
            roleKey: 'visitingInstructor',
            image: '/images/temple2.webp',
        },
        {
            name: 'Elena Vasi',
            roleKey: 'mindfulnessGuide',
            image: '/images/meditationHall.jpeg',
        },
    ];

    return (
        <section className="py-16 sm:py-24">
            <div className="flex flex-col items-center pb-12 text-center">
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                    {t('teachersTitle')}
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
                    {t('teachersSubtitle')}
                </p>
            </div>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {teachers.map((teacher, index) => (
                    <div key={index} className="flex flex-col items-center gap-4 text-center">
                        <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-200">
                            <Image
                                src={teacher.image}
                                alt={`Portrait of ${teacher.name}`}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-lg font-bold text-gray-900">
                                {teacher.name}
                            </p>
                            <p className="text-sm text-blue-900">
                                {t(teacher.roleKey)}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

