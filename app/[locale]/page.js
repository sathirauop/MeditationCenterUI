'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock, Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FAQ from '@/components/sections/FAQ';
import EventCard from '@/components/events/EventCard';
import { useEvents } from '@/lib/hooks/use-events';

export default function Home() {
  // Translations
  const t = useTranslations('Home');
  const tContact = useTranslations('Contact');
  const tCommon = useTranslations('Common');
  const tEvents = useTranslations('Events');
  const tNav = useTranslations('Navigation');

  // Use React Query hook for events
  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useEvents({ limit: 4, offset: 0 });

  // Ensure events is always an array
  const events = Array.isArray(eventsData) ? eventsData : [];

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
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            {t('heroTitle')}
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">
            {t('heroSubtitle')}
          </p>
          <Link href="/programs/meditation">
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-lg">
              {t('heroCta')}
            </Button>
          </Link>
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
                {t('welcomeTitle')}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-center max-w-7xl mx-auto">
              {/* Left side - Quote Card */}
              <div className="bg-muted/30 rounded-2xl p-12 shadow-sm">
                <blockquote className="space-y-8">
                  <p className="text-xl md:text-2xl leading-relaxed text-foreground font-light">
                    {t('welcomeDescription')}
                  </p>
                </blockquote>

                <div className="mt-10">
                  <Link href="/about">
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full border-2 border-primary/20 hover:border-primary px-8 py-6 text-base"
                    >
                      {tNav('aboutUs')}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right side - Image with decorative element */}
              <div className="relative">
                <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/meditationHall.jpeg"
                    alt="Buddha statue in meditation center"
                    fill
                    style={{ objectFit: 'cover' }}
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
          <h2 className="text-4xl font-bold mb-8">{t('programTitle')}</h2>
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground max-w-3xl">
                  {t('programDescription')}
                </p>
                <Link href="/programs/meditation">
                  <Button size="lg" className="ml-8">
                    {tCommon('join')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12">{tEvents('upcomingEvents')}</h2>

          {/* Loading State */}
          {eventsLoading && (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">{tCommon('loadingEvents')}</span>
            </div>
          )}

          {/* Error State */}
          {eventsError && !eventsLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <p className="text-destructive font-medium mb-2">{t('failedToLoadEvents')}</p>
              <p className="text-sm text-muted-foreground">{eventsError?.message || 'An error occurred'}</p>
            </div>
          )}

          {/* Empty State */}
          {!eventsLoading && !eventsError && events.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-muted-foreground text-lg">{t('noEventsMessage')}</p>
              <p className="text-sm text-muted-foreground mt-2">{t('checkBackSoon')}</p>
            </div>
          )}

          {/* Events Grid */}
          {!eventsLoading && !eventsError && events.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event) => (
                <EventCard key={event.event_id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Us Section */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">{tContact('title')}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Phone & WhatsApp */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{tContact('phoneWhatsApp')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><a href="tel:+94717302179" className="text-primary hover:underline">{tContact('phoneNumber')}</a></p>
                <p className="text-sm text-muted-foreground">{tContact('availability')}</p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{tContact('location')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>{tContact('address')}<br />{tContact('city')}</p>
                <p><a href="#map" className="text-primary hover:underline text-sm">{tCommon('viewOnMap')}</a></p>
              </CardContent>
            </Card>

            {/* Operating Hours */}
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>{tContact('operatingHours')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>{tContact('dailyHours')}</p>
                <p className="text-sm text-muted-foreground">{tContact('sessionTimes')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

