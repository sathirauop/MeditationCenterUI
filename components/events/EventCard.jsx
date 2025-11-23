import { Card, CardContent } from '@/components/ui/card';
import { formatDate, formatTimeRange } from '@/lib/utils/date-utils';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

/**
 * EventCard Component
 * Displays event information in a card format
 *
 * @param {Object} event - Event data object
 * @param {number} event.event_id - Event ID
 * @param {string} event.name - Event name
 * @param {string} event.description - Event description
 * @param {string} event.event_date - Event date (YYYY-MM-DD)
 * @param {string} event.start_time - Start time (HH:MM:SS)
 * @param {string} event.end_time - End time (HH:MM:SS)
 * @param {string} event.location - Event location
 * @param {string} event.cover_image_url - Cover image presigned URL from Cloudflare R2
 * @param {Array|null} event.gallery_image_urls - Array of gallery image presigned URLs
 */
export default function EventCard({ event }) {
  const {
    name,
    description,
    event_date,
    start_time,
    end_time,
    location,
    cover_image_url,
    gallery_image_urls
  } = event;

  // Truncate description to 150 characters
  const truncatedDescription = description && description.length > 150
    ? `${description.substring(0, 150)}...`
    : description;

  // Use cover image or first gallery image as fallback
  const eventImage = cover_image_url || (gallery_image_urls && gallery_image_urls.length > 0 ? gallery_image_urls[0] : null);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {eventImage ? (
          <Image
            src={eventImage}
            alt={name}
            fill
            className="object-cover"
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
