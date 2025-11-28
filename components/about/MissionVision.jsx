import React from 'react';

/**
 * MissionVision Component
 * Displays the mission and vision statement
 */
export default function MissionVision() {
    return (
        <section className="py-16 sm:py-24">
            <div className="flex flex-col items-center text-center">
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
                    Our Mission & Vision
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-600">
                    To provide a welcoming and supportive environment where individuals from all walks of life can learn and practice the timeless teachings of the Buddha, fostering inner peace, wisdom, and a compassionate heart for the benefit of all beings.
                </p>
            </div>
        </section>
    );
}
