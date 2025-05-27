/**
 * Utility function to handle image URLs with or without proxy
 * 
 * This function helps handle image URLs in a way that works both locally and when deployed
 * It provides a fallback mechanism when wsrv.nl is blocked or not working properly
 */

/**
 * Process an image URL to ensure it displays correctly in all environments
 * @param {string} imageUrl - The original image URL from the API
 * @param {Object} options - Optional configuration
 * @param {boolean} options.useProxy - Whether to use wsrv.nl proxy (default: false)
 * @param {string} options.fallbackImage - URL to use if the image fails to load
 * @returns {string} - The processed image URL
 */
export const getImageUrl = (imageUrl, options = {}) => {
  // Default options
  const { useProxy = false, fallbackImage = "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg" } = options;
  
  // If no image URL provided, return fallback
  if (!imageUrl) return fallbackImage;
  
  // Check if we're in development environment (localhost)
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  // In development, we can use wsrv.nl proxy as it works fine
  if (isDevelopment && useProxy) {
    return `https://wsrv.nl/?url=${imageUrl}`;
  }
  
  // In production, use the direct URL to avoid proxy issues
  return imageUrl;
};

/**
 * React onError handler for images
 * @param {Event} e - The error event
 * @param {string} fallbackImage - URL to fallback image
 */
export const handleImageError = (e, fallbackImage = "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg") => {
  e.target.src = fallbackImage;
}; 