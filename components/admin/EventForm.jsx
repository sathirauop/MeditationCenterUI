'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X } from 'lucide-react';

// Validation schema
const eventSchema = z.object({
  name: z.string().min(3, 'Event name must be at least 3 characters'),
  name_si: z.string().optional(), // Sinhala name (optional)
  description: z.string().min(10, 'Description must be at least 10 characters'),
  description_si: z.string().optional(), // Sinhala description (optional)
  eventDate: z.string().min(1, 'Event date is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  location: z.string().min(3, 'Location is required'),
}).refine((data) => {
  // Validate that end time is after start time
  if (data.startTime && data.endTime) {
    return data.endTime > data.startTime;
  }
  return true;
}, {
  message: 'End time must be after start time',
  path: ['endTime'],
});

export default function EventForm({ onSubmit, isLoading, initialData = null }) {
  const [coverImage, setCoverImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const defaultValues = initialData ? {
    name: initialData.name,
    name_si: initialData.name_si || '',
    description: initialData.description,
    description_si: initialData.description_si || '',
    eventDate: initialData.event_date,
    startTime: initialData.start_time ? initialData.start_time.substring(0, 5) : '', // Trim seconds if present
    endTime: initialData.end_time ? initialData.end_time.substring(0, 5) : '',
    location: initialData.location,
  } : undefined;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues,
  });

  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setGalleryImages((prev) => [...prev, ...files]);
  };

  const removeCoverImage = () => {
    setCoverImage(null);
  };

  const removeGalleryImage = (index) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = async (data) => {
    await onSubmit(data, coverImage, galleryImages);
    if (!initialData) {
      reset();
      setCoverImage(null);
      setGalleryImages([]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      {/* Event Name (English) */}
      <div className="space-y-2">
        <Label htmlFor="name">Event Name (English) *</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="e.g., Full Moon Meditation Ceremony"
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      {/* Event Name (Sinhala) */}
      <div className="space-y-2">
        <Label htmlFor="name_si">Event Name (Sinhala) <span className="text-muted-foreground text-xs">— සිංහල</span></Label>
        <Input
          id="name_si"
          {...register('name_si')}
          placeholder="උදා: පුන් පොහෝ භාවනා උත්සවය"
          disabled={isLoading}
          className="font-sinhala"
        />
      </div>

      {/* Description (English) */}
      <div className="space-y-2">
        <Label htmlFor="description">Description (English) *</Label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter a detailed description of the event..."
          rows={4}
          disabled={isLoading}
        />
        {errors.description && (
          <p className="text-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      {/* Description (Sinhala) */}
      <div className="space-y-2">
        <Label htmlFor="description_si">Description (Sinhala) <span className="text-muted-foreground text-xs">— සිංහල</span></Label>
        <Textarea
          id="description_si"
          {...register('description_si')}
          placeholder="සිදුවීම පිළිබඳ විස්තරාත්මක විස්තරයක් ඇතුළත් කරන්න..."
          rows={4}
          disabled={isLoading}
          className="font-sinhala"
        />
      </div>

      {/* Event Date */}
      <div className="space-y-2">
        <Label htmlFor="eventDate">Event Date *</Label>
        <Input
          id="eventDate"
          type="date"
          {...register('eventDate')}
          disabled={isLoading}
        />
        {errors.eventDate && (
          <p className="text-sm text-destructive">{errors.eventDate.message}</p>
        )}
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time *</Label>
          <Input
            id="startTime"
            type="time"
            {...register('startTime')}
            disabled={isLoading}
          />
          {errors.startTime && (
            <p className="text-sm text-destructive">{errors.startTime.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">End Time *</Label>
          <Input
            id="endTime"
            type="time"
            {...register('endTime')}
            disabled={isLoading}
          />
          {errors.endTime && (
            <p className="text-sm text-destructive">{errors.endTime.message}</p>
          )}
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location *</Label>
        <Input
          id="location"
          {...register('location')}
          placeholder="e.g., Main Meditation Hall"
          disabled={isLoading}
        />
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location.message}</p>
        )}
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label htmlFor="coverImage">Cover Image (Optional)</Label>
        <div className="flex items-center gap-4">
          <Input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={handleCoverImageChange}
            disabled={isLoading || coverImage !== null}
            className="flex-1"
          />
          {coverImage && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{coverImage.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeCoverImage}
                disabled={isLoading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Upload a cover image for the event
        </p>
      </div>

      {/* Gallery Images */}
      <div className="space-y-2">
        <Label htmlFor="galleryImages">Gallery Images (Optional)</Label>
        <Input
          id="galleryImages"
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryImagesChange}
          disabled={isLoading}
        />
        {galleryImages.length > 0 && (
          <div className="mt-2 space-y-1">
            {galleryImages.map((file, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground flex-1">{file.name}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeGalleryImage(index)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Upload multiple images for the event gallery
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Event' : 'Create Event')}
        </Button>
      </div>
    </form>
  );
}
