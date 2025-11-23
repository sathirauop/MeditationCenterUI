import React from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Brain, Lightbulb } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            {/* ⛩️ Section 1: The Hero (Arrival) */}
            <section
                className="relative h-[60vh] flex items-center justify-center text-center text-white"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 77, 122, 0.6), rgba(0, 77, 122, 0.4)), url('/images/temple1.jpg')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="container px-4 mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold drop-shadow-md">
                        Preserving the Dhamma,<br />Nurturing the Mind
                    </h1>
                </div>
            </section>

            {/* 💎 Section 2: The Mission (Right Intention) */}
            <section className="py-20 bg-background text-center">
                <div className="container px-4 mx-auto max-w-3xl">
                    <span className="block text-4xl mb-4 text-primary animate-pulse">🪷</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Our Mission</h2>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                        We are dedicated to providing a sanctuary for spiritual growth,
                        helping individuals cultivate mindfulness, wisdom, and compassion
                        through the authentic teachings of the Buddha.
                    </p>
                </div>
            </section>

            {/* 📜 Section 3: Our Story (Origin) */}
            <section className="py-20 bg-secondary/30">
                <div className="container px-4 mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6 order-2 md:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Our Story</h2>
                            <div className="space-y-4 text-muted-foreground text-lg">
                                <p>
                                    Founded in the serene hills of Sri Lanka, Isipathana International Meditation Center began as a humble gathering place for seekers of truth.
                                </p>
                                <p>
                                    Over the decades, it has grown into a global community, yet our core purpose remains unchanged: to offer a quiet space where the noise of the world fades, and the clarity of the mind emerges.
                                </p>
                            </div>
                        </div>
                        <div className="relative h-[300px] md:h-[400px] w-full order-1 md:order-2">
                            <Image
                                src="/images/meditationHall.jpeg"
                                alt="The Meditation Hall"
                                fill
                                className="object-cover rounded-2xl shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* 🏛️ Section 4: Core Values (Pillars) */}
            <section className="py-24 bg-primary/5">
                <div className="container px-4 mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Core Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Metta */}
                        <Card className="border-t-4 border-t-primary hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md bg-card">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    <Heart className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Metta</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground">
                                <p>Cultivating boundless loving-kindness for all living beings.</p>
                            </CardContent>
                        </Card>

                        {/* Sati */}
                        <Card className="border-t-4 border-t-primary hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md bg-card">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    <Brain className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Sati</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground">
                                <p>Practicing right mindfulness in every moment of our lives.</p>
                            </CardContent>
                        </Card>

                        {/* Panna */}
                        <Card className="border-t-4 border-t-primary hover:-translate-y-1 transition-transform duration-300 shadow-sm hover:shadow-md bg-card">
                            <CardHeader className="text-center pb-2">
                                <div className="mx-auto bg-primary/10 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                                    <Lightbulb className="w-8 h-8 text-primary" />
                                </div>
                                <CardTitle className="text-2xl">Panna</CardTitle>
                            </CardHeader>
                            <CardContent className="text-center text-muted-foreground">
                                <p>Developing wisdom to see the true nature of reality.</p>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
