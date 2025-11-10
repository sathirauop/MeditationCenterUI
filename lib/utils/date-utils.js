/**
 * Format date string to readable format
 * @param {string} dateString - Date in YYYY-MM-DD format
 * @returns {string} Formatted date (e.g., "May 15, 2025")
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format time string to 12-hour format
 * @param {string} timeString - Time in HH:MM:SS format
 * @returns {string} Formatted time (e.g., "9:00 AM")
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';

  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours, 10);
    const minute = parseInt(minutes, 10);

    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');

    return `${displayHour}:${displayMinute} ${period}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};

/**
 * Format time range
 * @param {string} startTime - Start time in HH:MM:SS format
 * @param {string} endTime - End time in HH:MM:SS format
 * @returns {string} Formatted time range (e.g., "9:00 AM - 12:00 PM")
 */
export const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return '';
  return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

/**
 * Check if event is upcoming
 * @param {string} eventDate - Event date in YYYY-MM-DD format
 * @returns {boolean} True if event is in the future
 */
export const isUpcoming = (eventDate) => {
  if (!eventDate) return false;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);

    return event >= today;
  } catch (error) {
    console.error('Error checking if upcoming:', error);
    return false;
  }
};

/**
 * Get relative time (e.g., "in 3 days", "tomorrow", "today")
 * @param {string} eventDate - Event date in YYYY-MM-DD format
 * @returns {string} Relative time string
 */
export const getRelativeTime = (eventDate) => {
  if (!eventDate) return '';

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const event = new Date(eventDate);
    event.setHours(0, 0, 0, 0);

    const diffTime = event - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 1 && diffDays <= 7) return `In ${diffDays} days`;
    if (diffDays < -1 && diffDays >= -7) return `${Math.abs(diffDays)} days ago`;

    return formatDate(eventDate);
  } catch (error) {
    console.error('Error getting relative time:', error);
    return formatDate(eventDate);
  }
};
