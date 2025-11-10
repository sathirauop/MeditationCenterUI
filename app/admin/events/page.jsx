'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Loader2, MapPin, Clock } from 'lucide-react';
import CreateEventDialog from '@/components/admin/CreateEventDialog';
import { useEvents } from '@/lib/hooks/use-events';

export default function EventsManagementPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Use React Query hook - TODO: Replace with admin endpoint when available
  const { data: eventsData, isLoading, error } = useEvents();

  // Ensure events is always an array
  const events = Array.isArray(eventsData) ? eventsData : [];

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
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Button>
        </div>

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
                <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                    <div className="flex items-start justify-between">
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
                      <div className="ml-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            event.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {event.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create Event Dialog */}
        <CreateEventDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      </div>
    </div>
  );
}
