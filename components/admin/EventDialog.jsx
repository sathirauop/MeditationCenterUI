'use client';

import { useState, useEffect } from 'react';
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
import { useCreateEvent, useUpdateEvent } from '@/lib/hooks/use-events';

export default function EventDialog({ open, onOpenChange, eventToEdit = null }) {
    const [success, setSuccess] = useState(false);

    // Use React Query mutations
    const createEventMutation = useCreateEvent();
    const updateEventMutation = useUpdateEvent();

    const isEditing = !!eventToEdit;
    const isLoading = createEventMutation.isPending || updateEventMutation.isPending;
    const isError = createEventMutation.isError || updateEventMutation.isError;
    const error = createEventMutation.error || updateEventMutation.error;

    // Reset state when dialog opens/closes
    useEffect(() => {
        if (!open) {
            setSuccess(false);
            createEventMutation.reset();
            updateEventMutation.reset();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleSubmit = async (data, coverImage, galleryImages) => {
        setSuccess(false);

        // Transform the form data to match the backend API format
        const eventData = {
            name: data.name,
            name_si: data.name_si || null, // Sinhala name (optional)
            description: data.description,
            description_si: data.description_si || null, // Sinhala description (optional)
            eventDate: data.eventDate,
            startTime: data.startTime,
            endTime: data.endTime,
            location: data.location,
            isActive: isEditing ? eventToEdit.is_active : true, // Preserve status on edit
        };

        try {
            if (isEditing) {
                // Update Event with optional image changes
                await updateEventMutation.mutateAsync({
                    id: eventToEdit.event_id,
                    eventData,
                    coverImage,
                    galleryImages,
                });
            } else {
                // Create Event
                await createEventMutation.mutateAsync({
                    eventData,
                    coverImage,
                    galleryImages,
                });
            }

            // Show success message
            setSuccess(true);

            // Close dialog after a short delay
            setTimeout(() => {
                setSuccess(false);
                onOpenChange(false);
            }, 2000);
        } catch (err) {
            console.error('Error saving event:', err);
            if (err.response) {
                console.error('Response data:', err.response.data);
                console.error('Response status:', err.response.status);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Event' : 'Create New Event'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the details of the meditation center event.'
                            : 'Fill in the details below to create a new meditation center event.'}
                    </DialogDescription>
                </DialogHeader>

                {/* Success Message */}
                {success && (
                    <Alert className="bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                            Event {isEditing ? 'updated' : 'created'} successfully! The dialog will close automatically.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Error Message */}
                {isError && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error?.message || `Failed to ${isEditing ? 'update' : 'create'} event. Please try again.`}
                        </AlertDescription>
                    </Alert>
                )}

                {/* Event Form */}
                {/* We key the form by event ID (or 'new') to force re-render/reset when switching events */}
                <EventForm
                    key={eventToEdit ? eventToEdit.event_id : 'new'}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    initialData={eventToEdit}
                />
            </DialogContent>
        </Dialog>
    );
}
