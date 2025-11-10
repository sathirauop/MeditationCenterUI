'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import EventCard from '@/components/events/EventCard';
import { getEvents } from '@/lib/api/events';

export default function Home() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [eventsError, setEventsError] = useState(null);

  // Fetch events on component mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError(null);
        const response = await getEvents({ limit: 4, offset: 0 });
        setEvents(response.data || []);
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setEventsError(error.message || 'Failed to load events. Please try again later.');
      } finally {
        setEventsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative h-[99vh] flex items-center justify-center pt-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/temple2.webp"
            alt="Temple background"
            fill
            style={{objectFit: 'cover'}}
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Find Your Inner Peace
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            Join our meditation community and embark on a journey of mindfulness, wisdom, and spiritual growth in the heart of Sri Lanka.
          </p>
          <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg">
            Begin Your Journey
          </Button>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="relative -mt-12 z-10">
        <div className="container mx-auto px-6">
          {/* Main card with rounded top corners that overlaps hero */}
          <div className="bg-background rounded-[2rem] shadow-2xl px-8 md:px-16 py-16 md:py-24">
            {/* Main Heading */}
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight max-w-4xl mx-auto">
                Welcome to Isipathana International Meditation Center
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
            {/* Left side - Quote Card */}
            <div className="bg-muted/30 rounded-2xl p-12 shadow-sm">
              <blockquote className="space-y-8">
                <p className="text-xl md:text-2xl leading-relaxed text-foreground font-light">
                At Isipathana International Meditation Center, we offer a sanctuary for spiritual growth and inner development. Our center combines ancient Buddhist wisdom with modern meditation techniques, providing a comprehensive approach to mindfulness and enlightenment.
                </p>
                {/* <footer>
                  <cite className="text-primary text-lg font-semibold not-italic">
                    Tripple Gem Blessings
                  </cite>
                </footer> */}
              </blockquote>

              <div className="mt-10">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full border-2 border-primary/20 hover:border-primary px-8 py-6 text-base"
                >
                  About Us
                </Button>
              </div>
            </div>

            {/* Right side - Image with decorative element */}
            <div className="relative">
              <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/meditationHall.jpeg"
                  alt="Buddha statue in meditation center"
                  fill
                  style={{objectFit: 'cover'}}
                  className="hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Decorative floating element */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-2xl"></div>
              <div className="absolute -top-8 -left-8 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-orange-200/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Our Meditation Program */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8">Our Meditation Program</h2>
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground max-w-3xl">
                  Experience transformative meditation sessions designed for all levels. Our programs combine traditional Buddhist practices with modern mindfulness techniques, guided by experienced instructors in a peaceful environment.
                </p>
                <Button size="lg" className="ml-8">
                  Join
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12">Upcoming Events</h2>

          {/* Loading State */}
          {eventsLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading events...</span>
            </div>
          )}

          {/* Error State */}
          {eventsError && !eventsLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <p className="text-destructive font-medium mb-2">Failed to Load Events</p>
              <p className="text-sm text-muted-foreground">{eventsError}</p>
            </div>
          )}

          {/* Empty State */}
          {!eventsLoading && !eventsError && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-muted-foreground text-lg">No upcoming events at the moment.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for new events!</p>
            </div>
          )}

          {/* Events Grid */}
          {!eventsLoading && !eventsError && events.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event.eventId} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Phone & WhatsApp */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Phone & WhatsApp</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><a href="tel:+94771234567" className="text-primary hover:underline">+94 77 123 4567</a></p>
                <p className="text-sm text-muted-foreground">Available 9 AM - 6 PM</p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>123 Meditation Path<br/>Colombo, Sri Lanka</p>
                <p><a href="#map" className="text-primary hover:underline text-sm">View on Map</a></p>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
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
            {/* About Isipathana */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">About Isipathana</h4>
              <p className="text-sm text-muted-foreground">
                We are dedicated to preserving and sharing authentic Buddhist teachings and meditation practices for the benefit of all beings.
              </p>
              <div className="flex flex-col gap-2 text-sm">
                <p className="text-muted-foreground">📧 isipathana@gmail.com</p>
                <p className="text-muted-foreground">📍 Colombo, Sri Lanka</p>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Quick Links</h4>
              <div className="flex flex-col gap-2 text-sm">
                <a href="#about-us" className="text-muted-foreground hover:text-primary">About Us</a>
                <a href="#programs" className="text-muted-foreground hover:text-primary">Programs</a>
                <a href="#events" className="text-muted-foreground hover:text-primary">Events</a>
                <a href="#blog" className="text-muted-foreground hover:text-primary">Blog</a>
                <a href="#contact" className="text-muted-foreground hover:text-primary">Contact</a>
              </div>
            </div>

            {/* Resources */}
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

            {/* Contact Info */}
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
