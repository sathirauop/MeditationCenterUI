'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar as CalendarIcon, Users } from 'lucide-react';

export default function BookingWidget() {
    const [selectedDate, setSelectedDate] = useState('');
    const [seats, setSeats] = useState(1);

    return (
        <section className="py-20 bg-gray-50" id="booking">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4 text-blue-900">Book Your Meditation Program</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Join our guided meditation program. Select your preferred date and reserve your seats.
                        </p>
                    </div>

                    <Card className="shadow-lg border-0 bg-white">
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                {/* Date and Seats Selection */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Date Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <CalendarIcon className="inline w-4 h-4 mr-2" />
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={selectedDate}
                                            onChange={(e) => setSelectedDate(e.target.value)}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none transition-colors"
                                            placeholder="Select date"
                                        />
                                    </div>

                                    {/* Seats Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Users className="inline w-4 h-4 mr-2" />
                                            Seats
                                        </label>
                                        <select
                                            value={seats}
                                            onChange={(e) => setSeats(Number(e.target.value))}
                                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none transition-colors"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                <option key={num} value={num}>{num} Seat{num > 1 ? 's' : ''}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Reserve Button */}
                                <Button
                                    className="w-full h-12 text-lg font-semibold bg-blue-900 hover:bg-blue-800 text-white shadow-md hover:shadow-lg transition-all"
                                    disabled={!selectedDate}
                                >
                                    Reserve Seats
                                </Button>

                                <p className="text-center text-sm text-gray-500">
                                    Free cancellation up to 24 hours before the program
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    );
}
