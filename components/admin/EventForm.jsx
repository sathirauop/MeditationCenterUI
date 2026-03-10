'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Upload, X, ImageIcon, Replace, Plus } from 'lucide-react';

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
  const isEditing = !!initialData;

  // Cover image state
  const [coverImage, setCoverImage] = useState(null); // New file to upload
  const [existingCoverUrl, setExistingCoverUrl] = useState(
    initialData?.cover_image_url || null
  );
  const [coverRemoved, setCoverRemoved] = useState(false);
  const coverInputRef = useRef(null);

  // Gallery images state
  const [newGalleryImages, setNewGalleryImages] = useState([]); // New files to upload
  const [existingGalleryUrls, setExistingGalleryUrls] = useState(
    initialData?.gallery_image_urls ? [...initialData.gallery_image_urls] : []
  );
  const galleryInputRef = useRef(null);

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

  // ---- Cover Image Handlers ----
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setCoverRemoved(false);
    }
  };

  const removeCoverImage = () => {
    setCoverImage(null);
    setExistingCoverUrl(null);
    setCoverRemoved(true);
    if (coverInputRef.current) {
      coverInputRef.current.value = '';
    }
  };

  const replaceCoverImage = () => {
    if (coverInputRef.current) {
      coverInputRef.current.click();
    }
  };

  // ---- Gallery Image Handlers ----
  const handleGalleryImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    setNewGalleryImages((prev) => [...prev, ...files]);
    // Reset input so the same file can be selected again
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  const removeNewGalleryImage = (index) => {
    setNewGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingGalleryImage = (index) => {
    setExistingGalleryUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // ---- Form Submit ----
  const onFormSubmit = async (data) => {
    // Only pass new gallery images (File objects) to the parent
    const galleryImagesToUpload = newGalleryImages.length > 0 ? newGalleryImages : [];

    await onSubmit(data, coverImage, galleryImagesToUpload);

    if (!initialData) {
      reset();
      setCoverImage(null);
      setExistingCoverUrl(null);
      setCoverRemoved(false);
      setNewGalleryImages([]);
      setExistingGalleryUrls([]);
    }
  };

  // ---- Helper: Generate preview URL for a File ----
  const getFilePreviewUrl = (file) => {
    try {
      return URL.createObjectURL(file);
    } catch {
      return null;
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

      {/* ============ COVER IMAGE SECTION ============ */}
      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Cover Image
          <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
        </Label>

        {/* Hidden file input */}
        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          onChange={handleCoverImageChange}
          disabled={isLoading}
          className="hidden"
        />

        {/* Show existing cover image OR new cover image preview */}
        {(coverImage || (existingCoverUrl && !coverRemoved)) ? (
          <div className="relative group rounded-lg overflow-hidden border border-border bg-muted/30">
            <div className="aspect-video w-full max-h-48 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={coverImage ? getFilePreviewUrl(coverImage) : existingCoverUrl}
                alt="Cover preview"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={replaceCoverImage}
                disabled={isLoading}
                className="shadow-lg"
              >
                <Replace className="h-3.5 w-3.5 mr-1.5" />
                Replace
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeCoverImage}
                disabled={isLoading}
                className="shadow-lg"
              >
                <X className="h-3.5 w-3.5 mr-1.5" />
                Remove
              </Button>
            </div>
            {/* Badge showing file name or "Current" */}
            <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-gradient-to-t from-black/60 to-transparent">
              <p className="text-xs text-white truncate">
                {coverImage ? `📎 ${coverImage.name}` : '✅ Current cover image'}
              </p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => coverInputRef.current?.click()}
            disabled={isLoading}
            className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Click to upload a cover image
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPEG, PNG, GIF, WebP — Max 5MB
            </p>
          </button>
        )}
      </div>

      {/* ============ GALLERY IMAGES SECTION ============ */}
      <div className="space-y-3">
        <Label className="text-base font-medium flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Gallery Images
          <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
        </Label>

        {/* Hidden file input for gallery */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleGalleryImagesChange}
          disabled={isLoading}
          className="hidden"
        />

        {/* Gallery grid: existing + new images */}
        {(existingGalleryUrls.length > 0 || newGalleryImages.length > 0) && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {/* Existing gallery images */}
            {existingGalleryUrls.map((url, index) => (
              <div
                key={`existing-${index}`}
                className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7 shadow-lg"
                    onClick={() => removeExistingGalleryImage(index)}
                    disabled={isLoading}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-[10px] text-white/80 truncate">Current</p>
                </div>
              </div>
            ))}

            {/* New gallery images (to be uploaded) */}
            {newGalleryImages.map((file, index) => (
              <div
                key={`new-${index}`}
                className="relative group aspect-square rounded-lg overflow-hidden border-2 border-primary/30 bg-muted/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={getFilePreviewUrl(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="h-7 w-7 shadow-lg"
                    onClick={() => removeNewGalleryImage(index)}
                    disabled={isLoading}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-gradient-to-t from-black/60 to-transparent">
                  <p className="text-[10px] text-emerald-300 truncate">📎 New</p>
                </div>
              </div>
            ))}

            {/* Add more button */}
            <button
              type="button"
              onClick={() => galleryInputRef.current?.click()}
              disabled={isLoading}
              className="aspect-square border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Add More</span>
            </button>
          </div>
        )}

        {/* Empty state: no images yet */}
        {existingGalleryUrls.length === 0 && newGalleryImages.length === 0 && (
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={isLoading}
            className="w-full border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 hover:bg-muted/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Click to upload gallery images
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Select multiple images — JPEG, PNG, GIF, WebP — Max 5MB each
            </p>
          </button>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" disabled={isLoading} size="lg">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? (initialData ? 'Updating...' : 'Creating...') : (initialData ? 'Update Event' : 'Create Event')}
        </Button>
      </div>
    </form>
  );
}
