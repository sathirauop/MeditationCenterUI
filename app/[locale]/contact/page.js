'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ----------------------------------------------------------------------
// 📝 CONFIGURATION VARIABLES
// Update these values to change the contact details across the page
// ----------------------------------------------------------------------
const CONTACT_DETAILS = {
    phone: '+94 71 730 2179',
    email: 'isipathanameditationcenter@gmail.com',
    address: {
        mapLink: 'https://maps.google.com/?q=Isipathanaramaya+Temple+Meddawatta+Matara+Sri+Lanka'
    },
    hours: {
        daily: 'Open for meditation & programs daily',
        sessions: 'Programs for all age groups'
    }
};

export default function ContactPage() {
    const t = useTranslations('ContactPage');
    const tContact = useTranslations('Contact');
    const tCommon = useTranslations('Common');

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement form submission logic
        alert(t('thankYouMessage'));
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {/* Hero Section - matches ProgramHero layout */}
            <section className="relative pt-20 bg-white">
                <div className="container mx-auto px-6 py-8">
                    <div className="relative h-[60vh] rounded-2xl overflow-hidden">
                        {/* Background Image */}
                        <Image
                            src="/images/temple2.webp"
                            alt={t('heroTitle')}
                            fill
                            style={{ objectFit: 'cover' }}
                            priority
                        />
                        <div className="absolute inset-0 bg-black/40"></div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex items-center justify-center px-6 text-center text-white">
                            <div className="max-w-3xl">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                                    {t('heroTitle')}
                                </h1>
                                <p className="text-base md:text-lg text-white/90 leading-relaxed">
                                    {t('heroSubtitle')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12">

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold mb-6">{t('getInTouch')}</h2>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {/* Phone */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <Phone className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{t('phone')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-1">{t('callOrWhatsApp')}</p>
                                        <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, '')}`} className="text-lg font-medium hover:text-primary transition-colors">
                                            {tContact('phoneNumber')}
                                        </a>
                                    </CardContent>
                                </Card>

                                {/* Email */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <Mail className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{t('email')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-1">{t('sendUsMessage')}</p>
                                        <a href={`mailto:${CONTACT_DETAILS.email}`} className="text-lg font-medium hover:text-primary transition-colors">
                                            {t('emailLabel')}
                                        </a>
                                    </CardContent>
                                </Card>

                                {/* Location */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <MapPin className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{tContact('location')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-1">{t('visitCenter')}</p>
                                        <p className="font-medium">{tContact('address')}</p>
                                        <p className="font-medium">{tContact('city')}</p>
                                        <a href={CONTACT_DETAILS.address.mapLink} className="text-primary text-sm hover:underline mt-2 inline-block">
                                            {tCommon('viewOnMap')}
                                        </a>
                                    </CardContent>
                                </Card>

                                {/* Hours */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <Clock className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">{t('hours')}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-1">{t('centerHours')}</p>
                                        <p className="font-medium">{tContact('dailyHours')}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{tContact('sessionTimes')}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-muted/10 p-8 rounded-2xl border border-border">
                            <h2 className="text-2xl font-bold mb-6">{t('formTitle')}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">{t('nameLabel')}</label>
                                        <Input id="name" placeholder={t('namePlaceholder')} required />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium">{t('phoneLabel')}</label>
                                        <Input id="phone" type="tel" placeholder={t('phonePlaceholder')} required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">{t('emailFormLabel')}</label>
                                    <Input id="email" type="email" placeholder={t('emailPlaceholder')} required />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">{t('messageLabel')}</label>
                                    <Textarea
                                        id="message"
                                        placeholder={t('messagePlaceholder')}
                                        className="min-h-[150px]"
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full text-lg py-6">
                                    {t('sendMessage')}
                                </Button>
                            </form>
                        </div>

                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

