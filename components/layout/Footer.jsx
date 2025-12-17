'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('Footer');

    return (
        <footer className="bg-background border-t py-12">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    {/* About Isipathana */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">{t('aboutIsipathana')}</h4>
                        <p className="text-sm text-muted-foreground">
                            {t('aboutDescription')}
                        </p>
                        <div className="flex flex-col gap-2 text-sm">
                            <p className="text-muted-foreground">📧 isipathana@gmail.com</p>
                            <p className="text-muted-foreground">📍 Colombo, Sri Lanka</p>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">{t('quickLinks')}</h4>
                        <div className="flex flex-col gap-2 text-sm">
                            <Link href="/about" className="text-muted-foreground hover:text-primary">{t('aboutUs')}</Link>
                            <Link href="/#programs" className="text-muted-foreground hover:text-primary">{t('programs')}</Link>
                            <Link href="/#events" className="text-muted-foreground hover:text-primary">{t('events')}</Link>
                            <Link href="/#blog" className="text-muted-foreground hover:text-primary">{t('blog')}</Link>
                            <Link href="/contact" className="text-muted-foreground hover:text-primary">{t('contact')}</Link>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">{t('resources')}</h4>
                        <div className="flex flex-col gap-2 text-sm">
                            <Link href="/#teachings" className="text-muted-foreground hover:text-primary">{t('teachings')}</Link>
                            <Link href="/#schedule" className="text-muted-foreground hover:text-primary">{t('classSchedule')}</Link>
                            <Link href="/#donate" className="text-muted-foreground hover:text-primary">{t('donate')}</Link>
                            <Link href="/#volunteer" className="text-muted-foreground hover:text-primary">{t('volunteer')}</Link>
                            <Link href="/#faq" className="text-muted-foreground hover:text-primary">{t('faq')}</Link>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">{t('contactInfo')}</h4>
                        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <p>📧 info@isipathana.lk</p>
                            <p>📱 +94 77 123 4567</p>
                            <p>📍 Colombo, Sri Lanka</p>
                        </div>
                    </div>
                </div>

                <div className="border-t pt-8 text-center text-sm text-muted-foreground">
                    <p>{t('copyright')}</p>
                </div>
            </div>
        </footer>
    );
}

