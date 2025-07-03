/**
 * Image utilities for proper URL formation
 */

const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://shop4shoot.com/';

/**
 * Get full image URL by adding BASE_URL to relative paths
 * @param {string} imagePath - Image path (can be relative or absolute)
 * @returns {string} Full image URL
 */
export const getFullImageUrl = (imagePath) => {
  // Check if imagePath is null, undefined, or not a string
  if (!imagePath || typeof imagePath !== 'string') {
    console.warn('🖼️ [ImageUtils] Invalid imagePath provided:', { imagePath, type: typeof imagePath });
    return '/images/placeholder.png';
  }

  // If it's already a full URL (starts with http), return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it's an absolute path starting with /, add BASE_URL
  if (imagePath.startsWith('/')) {
    const baseUrl = BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL;
    return `${baseUrl}${imagePath}`;
  }

  // If it's a relative path, add BASE_URL with /
  const baseUrl = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;
  return `${baseUrl}${imagePath}`;
};

/**
 * Extract image URL from basket item with multiple fallbacks
 * @param {Object} item - Basket item from API
 * @returns {string} Full image URL
 */
export const getBasketItemImageUrl = (item) => {
  // Validate input
  if (!item || typeof item !== 'object') {
    console.warn('🖼️ [ImageUtils] Invalid item provided to getBasketItemImageUrl:', item);
    return getFullImageUrl(null); // Will return placeholder
  }

  console.log('🖼️ [ImageUtils] Processing basket item image:', {
    itemId: item.id,
    itemName: item.name,
    rawImageData: {
      picture: item.picture,
      product_image: item.product_image,
      image: item.image,
      preview_picture: item.preview_picture,
      detail_picture: item.detail_picture
    }
  });

  let imagePath = null;

  // Try different image properties from the API response with type checking
  if (item.picture?.src && typeof item.picture.src === 'string') {
    imagePath = item.picture.src;
  } else if (item.product_image && typeof item.product_image === 'string') {
    imagePath = item.product_image;
  } else if (item.image && typeof item.image === 'string') {
    imagePath = item.image;
  } else if (item.preview_picture && typeof item.preview_picture === 'string') {
    imagePath = item.preview_picture;
  } else if (item.detail_picture && typeof item.detail_picture === 'string') {
    imagePath = item.detail_picture;
  }

  const fullImageUrl = getFullImageUrl(imagePath);
  
  console.log('🖼️ [ImageUtils] Final image URL:', {
    itemId: item.id,
    originalPath: imagePath,
    originalPathType: typeof imagePath,
    fullUrl: fullImageUrl
  });

  return fullImageUrl;
};

export default {
  getFullImageUrl,
  getBasketItemImageUrl
}; 