/**
 * Image utilities for proper URL formation
 */

const BASE_URL = process.env.NEXT_PUBLIC_PICTURES_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://old.shop4shoot.com/';

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

  const pickFrom = (value) => {
    // Accept string
    if (typeof value === 'string') return value;
    // Accept objects like { resized: { src }, src }
    if (value && typeof value === 'object') {
      if (value.resized?.src && typeof value.resized.src === 'string') return value.resized.src;
      if (value.src && typeof value.src === 'string') return value.src;
      if (value.url && typeof value.url === 'string') return value.url;
    }
    return null;
  };

  // Try different image properties from the API response with type checking
  imagePath = pickFrom(item.picture) 
    || pickFrom(item.product_image)
    || pickFrom(item.image)
    || pickFrom(item.preview_picture)
    || pickFrom(item.detail_picture)
    // Nested common containers from various APIs
    || pickFrom(item.PRODUCT?.picture)
    || pickFrom(item.PRODUCT?.preview_picture)
    || pickFrom(item.PRODUCT?.detail_picture)
    || pickFrom(item.product?.picture)
    || pickFrom(item.product?.preview_picture)
    || pickFrom(item.product?.detail_picture)
    || item.PRODUCT?.PREVIEW_PICTURE_SRC
    || item.PRODUCT?.DETAIL_PICTURE_SRC
    || item.product?.PREVIEW_PICTURE_SRC
    || item.product?.DETAIL_PICTURE_SRC
    || item.product?.imageUrl
    || item.product?.image;

  if (!imagePath && item.properties?.PREVIEW_PICTURE_SRC?.value) {
    imagePath = item.properties.PREVIEW_PICTURE_SRC.value;
  } else if (!imagePath && item.properties?.DETAIL_PICTURE_SRC?.value) {
    imagePath = item.properties.DETAIL_PICTURE_SRC.value;
  } else if (!imagePath && item.PREVIEW_PICTURE_SRC) {
    imagePath = item.PREVIEW_PICTURE_SRC;
  } else if (!imagePath && item.DETAIL_PICTURE_SRC) {
    imagePath = item.DETAIL_PICTURE_SRC;
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
