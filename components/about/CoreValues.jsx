import React from 'react';
import { Heart, Brain, Lightbulb } from 'lucide-react';

/**
 * CoreValues Component
 * Displays the three core values: Metta, Sati, and Panna
 */
export default function CoreValues() {
    const coreValues = [
        {
            icon: Heart,
            title: 'Metta (Loving-Kindness)',
            description: 'Cultivating an attitude of unconditional kindness and goodwill towards all beings.',
        },
        {
            icon: Brain,
            title: 'Sati (Mindfulness)',
            description: 'Developing present-moment awareness and a clear, non-judgmental attention.',
        },
        {
            icon: Lightbulb,
            title: 'Panna (Wisdom)',
            description: 'Gaining direct, experiential insight into the nature of reality.',
        },
    ];

    return (
        <section className="py-16 sm:py-24">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900 text-center mb-12">
                Our Core Values
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {coreValues.map((value, index) => {
                    const Icon = value.icon;
                    return (
                        <div
                            key={index}
                            className="flex flex-1 flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 text-center hover:shadow-lg transition-shadow"
                        >
                            <div className="mx-auto flex w-12 h-12 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <h3 className="text-lg font-bold leading-tight text-gray-900">
                                    {value.title}
                                </h3>
                                <p className="text-sm font-normal leading-normal text-gray-600">
                                    {value.description}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
