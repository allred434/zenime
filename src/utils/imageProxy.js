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
 * @param {boolean} options.forceDirect - Force direct URL even in development (default: false)
 * @param {string} options.fallbackImage - URL to use if the image fails to load
 * @param {string} options.section - Section name for targeted handling (optional)
 * @returns {string} - The processed image URL
 */
export const getImageUrl = (imageUrl, options = {}) => {
  // Default options
  const { 
    useProxy = false, 
    forceDirect = false,
    fallbackImage = "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg",
    section = null 
  } = options;
  
  // If no image URL provided, return fallback
  if (!imageUrl) return fallbackImage;
  
  // Check if we're in development environment (localhost)
  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';
  
  // Handle problematic sections differently when deployed
  const isProblematicSection = section && [
    'spotlight', 'trending', 'top-airing', 
    'most-popular', 'most-favorite', 'latest-completed'
  ].includes(section.toLowerCase());

  // In development, we can use wsrv.nl proxy as it works fine
  if (isDevelopment && useProxy && !forceDirect) {
    return `https://wsrv.nl/?url=${imageUrl}`;
  }
  
  // For problematic sections or when forceDirect is true, always use direct URL
  if (isProblematicSection || forceDirect) {
    return imageUrl;
  }
  
  // For other sections in production, try a different approach
  if (!isDevelopment) {
    // If the image URL already contains "wsrv.nl", extract the original URL
    if (imageUrl.includes('wsrv.nl')) {
      const urlParam = new URLSearchParams(imageUrl.split('?')[1]).get('url');
      return urlParam || imageUrl;
    }
    
    // Use direct URL in production to avoid proxy issues
    return imageUrl;
  }
  
  // Default fallback to direct URL
  return imageUrl;
};

/**
 * React onError handler for images with multiple fallback strategies
 * @param {Event} e - The error event
 * @param {Object} options - Options for error handling
 * @param {string} options.originalUrl - Original image URL before proxying
 * @param {string} options.fallbackImage - URL to fallback image
 * @param {Function} options.onFallbackUsed - Callback when fallback is used
 */
export const handleImageError = (e, options = {}) => {
  const { 
    originalUrl = null,
    fallbackImage = "https://i.postimg.cc/HnHKvHpz/no-avatar.jpg",
    onFallbackUsed = null
  } = options;
  
  // If we have the original URL and the current src is using wsrv.nl
  if (originalUrl && e.target.src.includes('wsrv.nl')) {
    // Try direct URL first
    e.target.src = originalUrl;
    
    // Add event listener for second failure
    e.target.onerror = () => {
      e.target.src = fallbackImage;
      e.target.onerror = null; // Prevent infinite loop
      if (onFallbackUsed && typeof onFallbackUsed === 'function') {
        onFallbackUsed();
      }
    };
  } else {
    // Default fallback
    e.target.src = fallbackImage;
    e.target.onerror = null; // Prevent infinite loop
  }
};

/**
 * Create an image component with built-in error handling
 * @param {Object} props - Component props
 * @param {string} props.src - Original image URL
 * @param {string} props.alt - Alt text
 * @param {string} props.className - CSS classes
 * @param {string} props.section - Section name for targeted handling
 * @param {Object} props.imgProps - Additional image props
 * @returns {React.Element} - Image element with error handling
 */
export const Image = ({ src, alt = "", className = "", section = null, ...imgProps }) => {
  // Process the image URL
  const processedSrc = getImageUrl(src, { section });
  
  // Create the image element with error handling
  return (
    <img
      src={processedSrc}
      alt={alt}
      className={className}
      onError={(e) => handleImageError(e, { originalUrl: src })}
      {...imgProps}
    />
  );
}; 