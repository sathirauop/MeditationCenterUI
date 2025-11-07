import axiosClient from '../axios-client';

/**
 * Events API functions
 */

/**
 * Get all events
 * @param {Object} params - Query parameters (filters, pagination)
 * @returns {Promise<Array>} List of events
 */
export const getEvents = async (params = {}) => {
  try {
    const response = await axiosClient.get('/events', { params });
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch events');
  }
};

/**
 * Get single event by ID
 * @param {string} eventId - Event ID
 * @returns {Promise<Object>} Event details
 */
export const getEvent = async (eventId) => {
  try {
    const response = await axiosClient.get(`/events/${eventId}`);
    return response;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch event');
  }
};

/**
 * Create new event (admin only)
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event
 */
export const createEvent = async (eventData) => {
  try {
    const response = await axiosClient.post('/events', eventData);
    return response;
  } catch (error) {
    if (error.status === 403) {
      throw new Error('You do not have permission to create events');
    }
    throw new Error(error.message || 'Failed to create event');
  }
};

/**
 * Update event (admin only)
 * @param {string} eventId - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} Updated event
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axiosClient.put(`/events/${eventId}`, eventData);
    return response;
  } catch (error) {
    if (error.status === 403) {
      throw new Error('You do not have permission to update events');
    }
    throw new Error(error.message || 'Failed to update event');
  }
};

/**
 * Delete event (admin only)
 * @param {string} eventId - Event ID
 * @returns {Promise<void>}
 */
export const deleteEvent = async (eventId) => {
  try {
    await axiosClient.delete(`/events/${eventId}`);
  } catch (error) {
    if (error.status === 403) {
      throw new Error('You do not have permission to delete events');
    }
    throw new Error(error.message || 'Failed to delete event');
  }
};

/**
 * Register for an event
 * @param {string} eventId - Event ID
 * @param {Object} registrationData - Registration data
 * @returns {Promise<Object>} Registration confirmation
 */
export const registerForEvent = async (eventId, registrationData) => {
  try {
    const response = await axiosClient.post(`/events/${eventId}/register`, registrationData);
    return response;
  } catch (error) {
    if (error.status === 409) {
      throw new Error('You are already registered for this event');
    } else if (error.status === 422) {
      throw new Error('Event is full or registration is closed');
    }
    throw new Error(error.message || 'Failed to register for event');
  }
};
