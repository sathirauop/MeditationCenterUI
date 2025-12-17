'use client';

import React from 'react';
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
    phone: '+94 77 123 4567',
    email: 'info@isipathana.lk',
    address: {
        line1: '123 Meditation Path',
        line2: 'Colombo, Sri Lanka',
        mapLink: '#map' // Replace with actual Google Maps link
    },
    hours: {
        daily: '6:00 AM - 8:00 PM',
        sessions: 'Meditation Sessions: 6 AM & 6 PM'
    }
};

export default function ContactPage() {
    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Implement form submission logic
        alert('Thank you for your message! We will get back to you soon.');
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            {/* Hero Section */}
            <section
                className="relative h-[50vh] flex items-center justify-center text-center text-white"
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 77, 122, 0.6), rgba(0, 77, 122, 0.4)), url('/images/temple2.webp')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="container px-4 mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold drop-shadow-md mb-4">Contact Us</h1>
                    <p className="text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm">
                        We are here to answer any questions you may have about our programs, retreats, or visiting the center. Reach out to us and we&apos;ll respond as soon as we can.
                    </p>
                </div>
            </section>

            <section className="py-16 bg-background">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12">

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>

                            <div className="grid sm:grid-cols-2 gap-6">
                                {/* Phone */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <Phone className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">Phone</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-1">Call or WhatsApp us</p>
                                        <a href={`tel:${CONTACT_DETAILS.phone.replace(/\s/g, '')}`} className="text-lg font-medium hover:text-primary transition-colors">
                                            {CONTACT_DETAILS.phone}
                                        </a>
                                    </CardContent>
                                </Card>

                                {/* Email */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <Mail className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">Email</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-1">Send us a message</p>
                                        <a href={`mailto:${CONTACT_DETAILS.email}`} className="text-lg font-medium hover:text-primary transition-colors">
                                            {CONTACT_DETAILS.email}
                                        </a>
                                    </CardContent>
                                </Card>

                                {/* Location */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <MapPin className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">Location</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-1">Visit our center</p>
                                        <p className="font-medium">{CONTACT_DETAILS.address.line1}</p>
                                        <p className="font-medium">{CONTACT_DETAILS.address.line2}</p>
                                        <a href={CONTACT_DETAILS.address.mapLink} className="text-primary text-sm hover:underline mt-2 inline-block">
                                            View on Map
                                        </a>
                                    </CardContent>
                                </Card>

                                {/* Hours */}
                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                                            <Clock className="w-6 h-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-xl">Hours</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground mb-1">Center Hours</p>
                                        <p className="font-medium">{CONTACT_DETAILS.hours.daily}</p>
                                        <p className="text-sm text-muted-foreground mt-1">{CONTACT_DETAILS.hours.sessions}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-muted/10 p-8 rounded-2xl border border-border">
                            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="name" className="text-sm font-medium">Name</label>
                                        <Input id="name" placeholder="Your name" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                                        <Input id="phone" type="tel" placeholder="Your phone number" required />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                                    <Input id="email" type="email" placeholder="Your email address" required />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                                    <Textarea
                                        id="message"
                                        placeholder="How can we help you?"
                                        className="min-h-[150px]"
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full text-lg py-6">
                                    Send Message
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
