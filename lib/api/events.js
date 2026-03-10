import axiosClient from '../axios-client';

/**
 * Events API functions
 */


/**
 * Create new event (admin only)
 * @param {Object} eventData - Event data (name, description, eventDate, startTime, endTime, location, isActive)
 * @param {File} coverImage - Optional cover image file
 * @param {File[]} galleryImages - Optional gallery image files
 * @returns {Promise<Object>} Created event
 */
export const createEvent = async (eventData, coverImage = null, galleryImages = []) => {
  try {
    // Create FormData for multipart/form-data request
    const formData = new FormData();

    // Add event data as JSON string
    formData.append('event', JSON.stringify(eventData));

    // Add cover image if provided
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    // Add gallery images if provided
    if (galleryImages && galleryImages.length > 0) {
      galleryImages.forEach((image) => {
        formData.append('galleryImages', image);
      });
    }

    // Post to the correct admin endpoint
    const response = await axiosClient.post('/admin/event', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    if (error.status === 403) {
      throw new Error('You do not have permission to create events');
    }
    throw new Error(error.message || 'Failed to create event');
  }
};

/**
 * Update existing event (admin only)
 * Supports partial updates - only provided fields will be updated.
 * Supports image updates via multipart/form-data.
 *
 * @param {number} eventId - The event ID to update
 * @param {Object} eventData - Optional event data to update (text fields)
 * @param {File|null} coverImage - Optional new cover image file (null to keep existing)
 * @param {File[]} galleryImages - Optional new gallery image files (empty array to keep existing)
 * @returns {Promise<Object>} Updated event
 */
export const updateEvent = async (eventId, eventData = null, coverImage = null, galleryImages = []) => {
  try {
    // Check if we have any images to upload
    const hasImages = coverImage || (galleryImages && galleryImages.length > 0);

    if (hasImages) {
      // Use multipart/form-data when images are involved
      const formData = new FormData();

      // Add event data as JSON string if provided
      if (eventData && Object.keys(eventData).length > 0) {
        formData.append('event', JSON.stringify(eventData));
      }

      // Add cover image if provided
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      // Add gallery images if provided
      if (galleryImages && galleryImages.length > 0) {
        galleryImages.forEach((image) => {
          formData.append('galleryImages', image);
        });
      }

      const response = await axiosClient.patch(`/admin/event/${eventId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } else {
      // Use JSON when only text fields are being updated (backward compatible)
      const response = await axiosClient.patch(`/admin/event/${eventId}`, eventData);
      return response;
    }
  } catch (error) {
    if (error.status === 403) {
      throw new Error('You do not have permission to update events');
    }
    if (error.status === 404) {
      throw new Error('Event not found');
    }
    throw new Error(error.message || 'Failed to update event');
  }
};
