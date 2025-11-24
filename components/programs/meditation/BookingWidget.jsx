'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Users, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function BookingWidget() {
    const [selectedDate, setSelectedDate] = useState(null);
    const [seats, setSeats] = useState(1);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isSeatsOpen, setIsSeatsOpen] = useState(false);

    // Mock calendar days for a month
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const formatDate = (day) => {
        return day ? `November ${day}, 2025` : 'Select date';
    };

    const calculateTotal = () => {
        const pricePerSeat = 50;
        return selectedDate ? seats * pricePerSeat : 0;
    };

    return (
        <section className="py-20 bg-muted/30" id="booking">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">Book Your Meditation Program</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Join our daily meditation sessions. Select your preferred date and reserve your seats.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                        {/* Left Side: Features */}
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Check className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Guided Sessions</h3>
                                    <p className="text-sm text-muted-foreground">Expert instruction for all levels</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Check className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Daily Programs</h3>
                                    <p className="text-sm text-muted-foreground">Available every day</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <Check className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Vegetarian Meals</h3>
                                    <p className="text-sm text-muted-foreground">Nutritious daily meals</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Compact Booking Card */}
                        <Card className="lg:col-span-2 shadow-xl border-0">
                            <CardContent className="p-6">
                                {/* Compact Booking Form */}
                                <div className="space-y-3">
                                    {/* Date and Seats Selection */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Date Popover */}
                                        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                            <PopoverTrigger asChild>
                                                <button className="flex flex-col items-start p-3 border-2 rounded-lg hover:border-primary transition-colors text-left">
                                                    <span className="text-xs font-medium text-muted-foreground mb-1">Date</span>
                                                    <div className="flex items-center gap-2 w-full">
                                                        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                                                        <span className={`text-sm font-medium ${selectedDate ? 'text-foreground' : 'text-muted-foreground'}`}>
                                                            {selectedDate ? `Nov ${selectedDate}` : 'Select date'}
                                                        </span>
                                                    </div>
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 p-4" align="start">
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold text-sm">Select Program Date</h4>

                                                    {/* Month Navigation */}
                                                    <div className="flex items-center justify-between">
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <ChevronLeft className="w-4 h-4" />
                                                        </Button>
                                                        <span className="text-sm font-semibold">November 2025</span>
                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                            <ChevronRight className="w-4 h-4" />
                                                        </Button>
                                                    </div>

                                                    {/* Calendar Grid */}
                                                    <div className="grid grid-cols-7 gap-1">
                                                        {weekDays.map((day, idx) => (
                                                            <div key={idx} className="text-xs font-medium text-muted-foreground text-center py-1">
                                                                {day}
                                                            </div>
                                                        ))}
                                                        <div></div>
                                                        <div></div>

                                                        {days.map(day => {
                                                            const isSelected = day === selectedDate;
                                                            const isDisabled = day === 15 || day === 16; // Example unavailable dates

                                                            return (
                                                                <button
                                                                    key={day}
                                                                    onClick={() => {
                                                                        if (!isDisabled) {
                                                                            setSelectedDate(day);
                                                                            setIsCalendarOpen(false);
                                                                        }
                                                                    }}
                                                                    className={`
                                                                        aspect-square rounded-md text-xs font-medium transition-all
                                                                        flex items-center justify-center
                                                                        ${isSelected
                                                                            ? 'bg-primary text-white shadow-sm'
                                                                            : 'hover:bg-primary/10 text-foreground'}
                                                                        ${isDisabled
                                                                            ? 'opacity-40 cursor-not-allowed line-through text-muted-foreground'
                                                                            : ''}
                                                                    `}
                                                                    disabled={isDisabled}
                                                                >
                                                                    {day}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    <p className="text-xs text-muted-foreground">
                                                        Programs available daily except marked dates
                                                    </p>
                                                </div>
                                            </PopoverContent>
                                        </Popover>

                                        {/* Seats Popover */}
                                        <Popover open={isSeatsOpen} onOpenChange={setIsSeatsOpen}>
                                            <PopoverTrigger asChild>
                                                <button className="flex flex-col items-start p-3 border-2 rounded-lg hover:border-primary transition-colors text-left">
                                                    <span className="text-xs font-medium text-muted-foreground mb-1">Seats</span>
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-muted-foreground" />
                                                        <span className="text-sm font-medium">{seats} {seats === 1 ? 'Seat' : 'Seats'}</span>
                                                    </div>
                                                </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-64 p-4" align="start">
                                                <div className="space-y-4">
                                                    <h4 className="font-semibold text-sm">Number of Seats</h4>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm">Seats</span>
                                                        <div className="flex items-center gap-3">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 rounded-full"
                                                                onClick={() => setSeats(Math.max(1, seats - 1))}
                                                                disabled={seats <= 1}
                                                            >
                                                                -
                                                            </Button>
                                                            <span className="w-8 text-center font-medium">{seats}</span>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 w-8 p-0 rounded-full"
                                                                onClick={() => setSeats(Math.min(10, seats + 1))}
                                                                disabled={seats >= 10}
                                                            >
                                                                +
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        className="w-full"
                                                        size="sm"
                                                        onClick={() => setIsSeatsOpen(false)}
                                                    >
                                                        Done
                                                    </Button>
                                                </div>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Selected Details - Shows when date selected */}
                                    {selectedDate && (
                                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <p className="text-xs text-muted-foreground mb-1">Selected Program</p>
                                                    <p className="font-semibold text-sm">{formatDate(selectedDate)}</p>
                                                    <p className="text-xs text-muted-foreground mt-1">{seats} {seats === 1 ? 'participant' : 'participants'}</p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-7 px-2 text-xs"
                                                    onClick={() => {
                                                        setSelectedDate(null);
                                                        setSeats(1);
                                                    }}
                                                >
                                                    Clear
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Price Summary */}
                                    {selectedDate && (
                                        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-muted-foreground">${50} × {seats} {seats === 1 ? 'seat' : 'seats'}</span>
                                                <span className="font-medium">${calculateTotal()}</span>
                                            </div>
                                            <div className="border-t border-border pt-2 flex justify-between items-center">
                                                <span className="font-semibold">Total</span>
                                                <span className="font-bold text-lg text-primary">${calculateTotal()}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <Button
                                        className="w-full h-12 font-semibold shadow-md hover:shadow-lg transition-all"
                                        disabled={!selectedDate}
                                    >
                                        Reserve Seats
                                    </Button>

                                    <p className="text-center text-xs text-muted-foreground">
                                        Free cancellation up to 24 hours before the program
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
