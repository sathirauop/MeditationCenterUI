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
