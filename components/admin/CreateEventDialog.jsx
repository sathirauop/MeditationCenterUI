'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import EventForm from './EventForm';
import { useCreateEvent } from '@/lib/hooks/use-events';

export default function CreateEventDialog({ open, onOpenChange }) {
  const [success, setSuccess] = useState(false);

  // Use React Query mutation
  const createEventMutation = useCreateEvent();

  const handleSubmit = async (data, coverImage, galleryImages) => {
    setSuccess(false);

    // Transform the form data to match the backend API format
    const eventData = {
      name: data.name,
      description: data.description,
      eventDate: data.eventDate, // Format: YYYY-MM-DD
      startTime: data.startTime,  // Format: HH:MM
      endTime: data.endTime,      // Format: HH:MM
      location: data.location,
      isActive: true,
    };

    try {
      // Call mutation with event data and images
      await createEventMutation.mutateAsync({
        eventData,
        coverImage,
        galleryImages,
      });

      // Show success message
      setSuccess(true);

      // Close dialog after a short delay
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      // Error is handled by React Query
      console.error('Error creating event:', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new meditation center event.
          </DialogDescription>
        </DialogHeader>

        {/* Success Message */}
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Event created successfully! The dialog will close automatically.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {createEventMutation.isError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {createEventMutation.error?.message || 'Failed to create event. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Event Form */}
        <EventForm onSubmit={handleSubmit} isLoading={createEventMutation.isPending} />
      </DialogContent>
    </Dialog>
  );
}
