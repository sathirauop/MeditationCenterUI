import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatTimeRange } from '@/lib/utils/date-utils';
import { Button } from '@/components/ui/button';

/**
 * EventCard Component
 * Displays event information in a card format
 *
 * @param {Object} event - Event data object
 * @param {number} event.eventId - Event ID
 * @param {string} event.name - Event name
 * @param {string} event.description - Event description
 * @param {string} event.eventDate - Event date (YYYY-MM-DD)
 * @param {string} event.startTime - Start time (HH:MM:SS)
 * @param {string} event.endTime - End time (HH:MM:SS)
 * @param {string} event.location - Event location
 * @param {Array|null} event.images - Array of image URLs
 */
export default function EventCard({ event }) {
  const {
    name,
    description,
    eventDate,
    startTime,
    endTime,
    location,
    images
  } = event;

  // Truncate description to 150 characters
  const truncatedDescription = description && description.length > 150
    ? `${description.substring(0, 150)}...`
    : description;

  // Get the first image or use a placeholder
  const eventImage = images && images.length > 0 ? images[0] : null;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {eventImage ? (
          <img
            src={eventImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image available</span>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-6 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-xl font-semibold mb-3 line-clamp-2">{name}</h3>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
            {truncatedDescription}
          </p>
        )}

        {/* Spacer to push button to bottom */}
        <div className="flex-1" />

        {/* Learn More Button */}
        <Button
          variant="link"
          className="text-primary hover:text-primary/80 p-0 h-auto justify-start font-medium"
        >
          Learn More
          <span className="ml-1 text-primary">›</span>
        </Button>
      </CardContent>
    </Card>
  );
}
