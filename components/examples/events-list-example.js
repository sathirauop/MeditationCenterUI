'use client';

import { useEvents, useRegisterForEvent } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Calendar } from 'lucide-react';
import Image from 'next/image';

/**
 * Example component showing how to fetch and display events
 * Uses TanStack Query for server state management
 */
export default function EventsListExample() {
  // Fetch events from the server
  const { data: events, isLoading, isError, error } = useEvents();

  // Mutation for registering for an event
  const registerMutation = useRegisterForEvent();

  const handleRegister = (eventId) => {
    registerMutation.mutate(
      {
        eventId,
        registrationData: {
          /* user registration data */
        }
      },
      {
        onSuccess: () => {
          alert('Successfully registered for event!');
        },
        onError: (error) => {
          alert(`Registration failed: ${error.message}`);
        },
      }
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2">Loading events...</span>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading events: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Success state with data
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events?.data?.map((event) => (
          <Card key={event.event_id}>
            <CardHeader>
              {event.cover_image_url ? (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={event.cover_image_url}
                    alt={event.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
              )}
              <CardTitle>{event.name}</CardTitle>
              <CardDescription>
                {event.event_date} • {event.start_time} - {event.end_time}
                {event.location && (
                  <span className="block mt-1">{event.location}</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{event.description}</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleRegister(event.event_id)}
                disabled={registerMutation.isPending}
                className="w-full"
              >
                {registerMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Register Now'
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
