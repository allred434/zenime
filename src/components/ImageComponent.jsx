import React from 'react';
import { getImageUrl, handleImageError } from '../utils/imageProxy';

/**
 * Image component with built-in error handling
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