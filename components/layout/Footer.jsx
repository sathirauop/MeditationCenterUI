import React from 'react';

export default function Footer() {
    return (
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
                            <a href="/about" className="text-muted-foreground hover:text-primary">About Us</a>
                            <a href="/#programs" className="text-muted-foreground hover:text-primary">Programs</a>
                            <a href="/#events" className="text-muted-foreground hover:text-primary">Events</a>
                            <a href="/#blog" className="text-muted-foreground hover:text-primary">Blog</a>
                            <a href="/#contact" className="text-muted-foreground hover:text-primary">Contact</a>
                        </div>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-lg">Resources</h4>
                        <div className="flex flex-col gap-2 text-sm">
                            <a href="/#teachings" className="text-muted-foreground hover:text-primary">Teachings</a>
                            <a href="/#schedule" className="text-muted-foreground hover:text-primary">Class Schedule</a>
                            <a href="/#donate" className="text-muted-foreground hover:text-primary">Donate</a>
                            <a href="/#volunteer" className="text-muted-foreground hover:text-primary">Volunteer</a>
                            <a href="/#faq" className="text-muted-foreground hover:text-primary">FAQ</a>
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
    );
}
