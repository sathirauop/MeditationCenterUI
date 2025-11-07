'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Calendar, Heart, Lightbulb, MapPin, Phone, User, Target, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image src="/images/Logo1.jpeg" alt="Isipathana Logo" fill style={{objectFit: 'cover'}} />
              </div>
              <span className="font-semibold text-lg hidden sm:inline">Isipathana</span>
            </div>
            <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#programs" className="hover:text-primary transition-colors">Events & Programs</a></li>
              <li className="text-muted-foreground">🌐 EN / සිං</li>
            </ul>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/temple1.jpg"
            alt="Temple background"
            fill
            style={{objectFit: 'cover'}}
            priority
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
            Find Your Inner Peace
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Join our meditation community and embark on a journey of mindfulness, wisdom, and spiritual growth in the heart of Sri Lanka.
          </p>
          <Button size="lg" className="text-lg px-8 py-6">
            Begin Your Journey
          </Button>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Welcome to Isipathana</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground">
                At Isipathana International Meditation Center, we offer a sanctuary for spiritual growth and inner development. Our center combines ancient Buddhist wisdom with modern meditation techniques, providing a comprehensive approach to mindfulness and enlightenment.
              </p>
              <p className="text-lg text-muted-foreground">
                Whether you are a beginner seeking peace or an experienced practitioner deepening your practice, our welcoming community offers guidance, support, and authentic teachings rooted in the Buddha&apos;s original instructions.
              </p>
              <p className="text-lg text-muted-foreground">
                <strong className="text-foreground">Why Meditation Matters:</strong> In today&apos;s fast-paced world, meditation offers a path to clarity, compassion, and lasting peace. Through regular practice, discover profound benefits for your mental, emotional, and spiritual well-being.
              </p>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/meditationHall.jpeg"
                alt="Meditation Hall"
                fill
                style={{objectFit: 'cover'}}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Navigation Cards */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Explore Our Center</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>About Us</CardTitle>
                <CardDescription>
                  Discover our story, philosophy, and mission to spread mindfulness
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Programs</CardTitle>
                <CardDescription>
                  Join our regular meditation sessions and retreats
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Events</CardTitle>
                <CardDescription>
                  Special ceremonies, workshops, and spiritual gatherings
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Contact</CardTitle>
                <CardDescription>
                  Visit us or get in touch with our community
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Upcoming Highlights */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Upcoming Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <div className="text-sm text-muted-foreground mb-2">Next Event • December 15, 2025</div>
                <CardTitle>Weekend Meditation Retreat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join us for a transformative weekend of silent meditation, dharma talks, and mindful walking in our peaceful surroundings.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="text-sm text-muted-foreground mb-2">Latest Blog Post</div>
                <CardTitle>The Path to Inner Peace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Discover practical techniques for cultivating mindfulness in daily life and overcoming common meditation challenges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="text-sm text-muted-foreground mb-2">Community Testimonial</div>
                <CardTitle>&quot;A Life-Changing Experience&quot;</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  &quot;The teachings at Isipathana have transformed my life. I&apos;ve found peace, clarity, and a supportive spiritual community.&quot; - Sarah M.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Meditate Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Meditate?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Inner Peace</h3>
              <p className="text-primary-foreground/90">
                Find calmness and serenity amidst life&apos;s challenges through regular practice
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                <Lightbulb className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold">Mental Clarity</h3>
              <p className="text-primary-foreground/90">
                Sharpen your focus and develop clear, insightful thinking
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                <Heart className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-semibold">Compassion</h3>
              <p className="text-primary-foreground/90">
                Cultivate loving-kindness toward yourself and all beings
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Wisdom</h3>
              <p className="text-primary-foreground/90">
                Gain deep insights into the nature of reality and existence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Phone & WhatsApp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><a href="tel:+94771234567" className="text-primary hover:underline">+94 77 123 4567</a></p>
                <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>123 Meditation Path<br/>Colombo, Sri Lanka</p>
                <p><a href="#" className="text-primary hover:underline text-sm">View on Map</a></p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Operating Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>Daily: 6:00 AM - 8:00 PM</p>
                <p className="text-sm text-muted-foreground">Meditation Sessions: 6 AM & 6 PM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">About Isipathana</h4>
              <p className="text-sm text-muted-foreground">
                We are dedicated to preserving and sharing authentic Buddhist teachings and meditation practices for the benefit of all beings.
              </p>
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/70">
                  📘
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/70">
                  📷
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/70">
                  🐦
                </div>
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center cursor-pointer hover:bg-muted/70">
                  📺
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Quick Links</h4>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#about" className="text-muted-foreground hover:text-primary">About Us</a>
                <a href="#programs" className="text-muted-foreground hover:text-primary">Programs</a>
                <a href="#events" className="text-muted-foreground hover:text-primary">Events</a>
                <a href="#blog" className="text-muted-foreground hover:text-primary">Blog</a>
                <a href="#contact" className="text-muted-foreground hover:text-primary">Contact</a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Resources</h4>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#teachings" className="text-muted-foreground hover:text-primary">Teachings</a>
                <a href="#schedule" className="text-muted-foreground hover:text-primary">Class Schedule</a>
                <a href="#donate" className="text-muted-foreground hover:text-primary">Donate</a>
                <a href="#volunteer" className="text-muted-foreground hover:text-primary">Volunteer</a>
                <a href="#faq" className="text-muted-foreground hover:text-primary">FAQ</a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Contact Info</h4>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <p>📧 info@isipathana.lk</p>
                <p>📱 +94 77 123 4567</p>
                <p>📍 Colombo, Sri Lanka</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Isipathana International Meditation Center. All rights reserved. | 🌐 EN / සිංහල</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
