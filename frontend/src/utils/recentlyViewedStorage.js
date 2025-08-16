/**
 * Utility for managing recently viewed products in localStorage
 * Features:
 * - SSR-safe localStorage operations
 * - Maximum 10 products (FIFO)
 * - Deduplication by product ID
 * - Compatible with ProductCard component format
 */

const STORAGE_KEY = 'shop4shoot_recently_viewed';
const MAX_ITEMS = 10;

/**
 * Check if localStorage is available (SSR-safe)
 */
const isLocalStorageAvailable = () => {
  return typeof window !== 'undefined' && window.localStorage;
};

/**
 * Get recently viewed products from localStorage
 * @returns {Array} Array of product objects
 */
export const getRecentlyViewedProducts = () => {
  if (!isLocalStorageAvailable()) {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const products = JSON.parse(stored);
    
    // Validate that it's an array
    if (!Array.isArray(products)) {
      console.warn('Invalid recently viewed products data, resetting...');
      localStorage.removeItem(STORAGE_KEY);
      return [];
    }

    return products;
  } catch (error) {
    console.error('Error reading recently viewed products from localStorage:', error);
    // Clear corrupted data
    if (isLocalStorageAvailable()) {
      localStorage.removeItem(STORAGE_KEY);
    }
    return [];
  }
};

/**
 * Add a product to recently viewed list
 * @param {Object} product - Product object compatible with ProductCard
 * @param {string|number} product.id - Product ID
 * @param {string} product.imageUrl - Product image URL
 * @param {string} product.brand - Product brand
 * @param {string} product.name - Product name
 * @param {number} product.price - Product price
 * @param {string} product.productLink - Product link
 * @param {string} product.CATALOG_AVAILABLE - Availability status
 */
export const addRecentlyViewedProduct = (product) => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  if (!product || !product.id) {
    console.warn('Invalid product data for recently viewed');
    return;
  }

  try {
    const existingProducts = getRecentlyViewedProducts();
    
    // Remove existing product with same ID to avoid duplicates
    const filteredProducts = existingProducts.filter(
      p => String(p.id) !== String(product.id)
    );

    // Add new product to the beginning of the list
    const updatedProducts = [product, ...filteredProducts];

    // Limit to MAX_ITEMS (FIFO - remove oldest)
    const limitedProducts = updatedProducts.slice(0, MAX_ITEMS);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedProducts));
  } catch (error) {
    console.error('Error saving recently viewed product to localStorage:', error);
  }
};

/**
 * Clear all recently viewed products
 */
export const clearRecentlyViewedProducts = () => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing recently viewed products from localStorage:', error);
  }
};

/**
 * Remove a specific product from recently viewed list
 * @param {string|number} productId - Product ID to remove
 */
export const removeRecentlyViewedProduct = (productId) => {
  if (!isLocalStorageAvailable() || !productId) {
    return;
  }

  try {
    const existingProducts = getRecentlyViewedProducts();
    const filteredProducts = existingProducts.filter(
      p => String(p.id) !== String(productId)
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProducts));
  } catch (error) {
    console.error('Error removing recently viewed product from localStorage:', error);
  }
};

/**
 * Transform product data to compatible format for recently viewed
 * @param {Object} productData - Raw product data from API
 * @returns {Object} Transformed product data compatible with ProductCard
 */
export const transformProductForRecentlyViewed = (productData) => {
  if (!productData) {
    return null;
  }

  // Handle different possible data structures from API
  const id = productData.id || productData.ID || productData.productId;
  const name = productData.name || productData.NAME || productData.title;
  const brand = productData.brand || productData.BRAND || productData.brandName || 'Other';
  const price = productData.price || productData.PRICE || productData.CATALOG_PRICE || 0;
  const imageUrl = productData.imageUrl || productData.image || productData.PICTURE_SRC || productData.images?.[0]?.url || '/images/placeholder.png';
  const availability = productData.CATALOG_AVAILABLE || productData.available || 'Y';
  
  // Generate product link
  const productCode = productData.code || productData.CODE || productData.productCode || id;
  const productLink = `/detail/${productCode}`;

  return {
    id: String(id),
    imageUrl,
    brand,
    name,
    price: Number(price),
    productLink,
    CATALOG_AVAILABLE: availability
  };
};

export default {
  getRecentlyViewedProducts,
  addRecentlyViewedProduct,
  clearRecentlyViewedProducts,
  removeRecentlyViewedProduct,
  transformProductForRecentlyViewed
}; 