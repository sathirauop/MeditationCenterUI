import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AboutHero from '@/components/about/AboutHero';
import MissionVision from '@/components/about/MissionVision';
import CoreValues from '@/components/about/CoreValues';
import OurStory from '@/components/about/OurStory';
import OurTeachers from '@/components/about/OurTeachers';
import JourneyCTA from '@/components/about/JourneyCTA';

/**
 * About Page
 * Main about page showcasing the meditation center's mission, values, story, and teachers
 */
export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <Header />

            {/* Main Content */}
            <main className="flex flex-col items-center pt-25 py-10 sm:py-20">
                <div className="w-full max-w-5xl px-4">
                    {/* Hero Section */}
                    <AboutHero />

                    {/* Mission & Vision */}
                    <MissionVision />

                    {/* Core Values */}
                    <CoreValues />

                    {/* Our Story */}
                    <OurStory />

                    {/* Our Teachers */}
                    <OurTeachers />

                    {/* CTA Section */}
                    <JourneyCTA />
                </div>
            </main>

            <Footer />
        </div>
    );
}
