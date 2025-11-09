'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center pt-20">
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
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16">Welcome to International Isipathana Meditation Center</h2>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Left side - Text content */}
            <div className="space-y-6">
              <p className="text-base text-muted-foreground leading-relaxed">
                At Isipathana International Meditation Center, we offer a sanctuary for spiritual growth and inner development. Our center combines ancient Buddhist wisdom with modern meditation techniques, providing a comprehensive approach to mindfulness and enlightenment.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                Whether you are a beginner seeking peace or an experienced practitioner deepening your practice, our welcoming community offers guidance, support, and authentic teachings rooted in the Buddha&apos;s original instructions.
              </p>
              <Button variant="link" className="text-primary p-0 h-auto">
                See more...
              </Button>
            </div>

            {/* Right side - Image */}
            <div className="relative h-[350px] rounded-lg overflow-hidden shadow-lg">
              <Image
                src="/images/meditationHall.jpeg"
                alt="Images of meditation center"
                fill
                style={{objectFit: 'cover'}}
              />
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Event Card 1 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="bg-primary text-white p-4 text-center">
                  <CardTitle className="text-lg">Wesak</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-3 gap-0">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <span className="text-xs">Image 1</span>
                  </div>
                  <div className="aspect-square bg-muted/70 flex items-center justify-center">
                    <span className="text-xs">Image 2</span>
                  </div>
                  <div className="aspect-square bg-muted/50 flex items-center justify-center">
                    <span className="text-xs">Image 3</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div>
                    <p className="text-sm font-medium">Description:</p>
                    <p className="text-sm text-muted-foreground">Celebrate the birth, enlightenment, and passing of Buddha</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date:</p>
                    <p className="text-sm text-muted-foreground">May 15, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time:</p>
                    <p className="text-sm text-muted-foreground">6:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Card 2 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="bg-primary text-white p-4 text-center">
                  <CardTitle className="text-lg">Event Title</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-3 gap-0">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <span className="text-xs">Image 1</span>
                  </div>
                  <div className="aspect-square bg-muted/70 flex items-center justify-center">
                    <span className="text-xs">Image 2</span>
                  </div>
                  <div className="aspect-square bg-muted/50 flex items-center justify-center">
                    <span className="text-xs">Image 3</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div>
                    <p className="text-sm font-medium">Description:</p>
                    <p className="text-sm text-muted-foreground">Join us for this special event</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date:</p>
                    <p className="text-sm text-muted-foreground">December 20, 2025</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time:</p>
                    <p className="text-sm text-muted-foreground">5:00 PM - 7:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Card 3 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="bg-primary text-white p-4 text-center">
                  <CardTitle className="text-lg">Event Title</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-3 gap-0">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <span className="text-xs">Image 1</span>
                  </div>
                  <div className="aspect-square bg-muted/70 flex items-center justify-center">
                    <span className="text-xs">Image 2</span>
                  </div>
                  <div className="aspect-square bg-muted/50 flex items-center justify-center">
                    <span className="text-xs">Image 3</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div>
                    <p className="text-sm font-medium">Description:</p>
                    <p className="text-sm text-muted-foreground">Join us for this special event</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date:</p>
                    <p className="text-sm text-muted-foreground">January 10, 2026</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time:</p>
                    <p className="text-sm text-muted-foreground">9:00 AM - 11:00 AM</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Card 4 */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="bg-primary text-white p-4 text-center">
                  <CardTitle className="text-lg">Event Title</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="grid grid-cols-3 gap-0">
                  <div className="aspect-square bg-muted flex items-center justify-center">
                    <span className="text-xs">Image 1</span>
                  </div>
                  <div className="aspect-square bg-muted/70 flex items-center justify-center">
                    <span className="text-xs">Image 2</span>
                  </div>
                  <div className="aspect-square bg-muted/50 flex items-center justify-center">
                    <span className="text-xs">Image 3</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div>
                    <p className="text-sm font-medium">Description:</p>
                    <p className="text-sm text-muted-foreground">Join us for this special event</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date:</p>
                    <p className="text-sm text-muted-foreground">February 5, 2026</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Time:</p>
                    <p className="text-sm text-muted-foreground">3:00 PM - 6:00 PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
