'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Loader2, MapPin, Clock, Trash2, Pencil } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import EventDialog from '@/components/admin/EventDialog';
import { useEvents, useDeleteEvent } from '@/lib/hooks/use-events';

export default function EventsManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteEventId, setDeleteEventId] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(null);

  // Use React Query hook - TODO: Replace with admin endpoint when available
  const { data: eventsData, isLoading, error } = useEvents();
  const deleteEventMutation = useDeleteEvent();

  // Ensure events is always an array
  const events = Array.isArray(eventsData) ? eventsData : [];

  const handleCreateClick = () => {
    setEditingEvent(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (event) => {
    setEditingEvent(event);
    setIsDialogOpen(true);
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!deleteEventId) return;

    try {
      const response = await deleteEventMutation.mutateAsync(deleteEventId);
      setDeleteSuccess(response.message || 'Event deleted successfully');
      setDeleteEventId(null);

      // Clear success message after 3 seconds
      setTimeout(() => setDeleteSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting event:', err);
      setDeleteEventId(null);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Events Management</h1>
            <p className="text-muted-foreground">
              Create and manage meditation center events
            </p>
          </div>
          <Button onClick={handleCreateClick}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

        {/* Success Message */}
        {deleteSuccess && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {deleteSuccess}
            </AlertDescription>
          </Alert>
        )}

        {/* Error Message */}
        {deleteEventMutation.isError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {deleteEventMutation.error?.message || 'Failed to delete event. Please try again.'}
            </AlertDescription>
          </Alert>
        )}

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Events ({events.length})
            </CardTitle>
            <CardDescription>
              Manage your meditation center events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-destructive mb-4">{error?.message || 'Failed to load events'}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : events.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  Get started by creating your first event. Events will appear here once created.
                </p>
                <Button onClick={handleCreateClick}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Event
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.event_id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Cover Image Preview */}
                      {event.cover_image_url && (
                        <div className="flex-shrink-0">
                          <Image
                            src={event.cover_image_url}
                            alt={event.name}
                            width={96}
                            height={96}
                            className="object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {/* Event Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">{event.name}</h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {event.description}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(event.event_date).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Clock className="h-4 w-4" />
                                <span>{event.start_time} - {event.end_time}</span>
                              </div>
                              {event.location && (
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  <span>{event.location}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1">
                            {/* Edit Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditClick(event)}
                              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                              title="Edit event"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            {/* Delete Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteEventId(event.event_id)}
                              disabled={deleteEventMutation.isPending}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                              title="Delete event"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Event Dialog */}
        <EventDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          eventToEdit={editingEvent}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteEventId} onOpenChange={(open) => !open && setDeleteEventId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the event
                and all associated images from the server.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteEventMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteEvent}
                disabled={deleteEventMutation.isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {deleteEventMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Event'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
