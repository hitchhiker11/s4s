import { useState, useEffect, useCallback } from 'react';
import {
  getRecentlyViewedProducts,
  addRecentlyViewedProduct,
  clearRecentlyViewedProducts,
  transformProductForRecentlyViewed
} from '../utils/recentlyViewedStorage';

/**
 * Hook for managing recently viewed products
 * Provides methods to add, get, and clear recently viewed products
 * SSR-safe with localStorage persistence
 */
export const useRecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load recently viewed products from localStorage on component mount
  useEffect(() => {
    const loadRecentlyViewed = () => {
      try {
        const products = getRecentlyViewedProducts();
        setRecentlyViewed(products);
      } catch (error) {
        // console.error('Error loading recently viewed products:', error);
        setRecentlyViewed([]);
      } finally {
        setIsLoaded(true);
      }
    };

    // Only load on client side to avoid SSR mismatch
    if (typeof window !== 'undefined') {
      loadRecentlyViewed();
    } else {
      setIsLoaded(true);
    }
  }, []);

  /**
   * Add a product to recently viewed list
   * @param {Object} productData - Raw product data from API or component
   */
  const addRecentlyViewed = useCallback((productData) => {
    if (!productData) {
      // console.warn('No product data provided to addRecentlyViewed');
      return;
    }

    try {
      // Transform product data to compatible format
      const transformedProduct = transformProductForRecentlyViewed(productData);
      
      if (!transformedProduct) {
        // console.warn('Failed to transform product data for recently viewed');
        return;
      }

      // Add to storage
      addRecentlyViewedProduct(transformedProduct);

      // Update state
      setRecentlyViewed(prevProducts => {
        // Remove existing product with same ID to avoid duplicates
        const filteredProducts = prevProducts.filter(
          p => String(p.id) !== String(transformedProduct.id)
        );

        // Add new product to the beginning
        const updatedProducts = [transformedProduct, ...filteredProducts];

        // Limit to 10 items
        return updatedProducts.slice(0, 10);
      });
    } catch (error) {
      // console.error('Error adding product to recently viewed:', error);
    }
  }, []);

  /**
   * Clear all recently viewed products
   */
  const clearRecentlyViewed = useCallback(() => {
    try {
      clearRecentlyViewedProducts();
      setRecentlyViewed([]);
    } catch (error) {
      // console.error('Error clearing recently viewed products:', error);
    }
  }, []);

  /**
   * Refresh recently viewed products from storage
   * Useful when localStorage might have been updated from another tab/window
   */
  const refreshRecentlyViewed = useCallback(() => {
    try {
      const products = getRecentlyViewedProducts();
      setRecentlyViewed(products);
    } catch (error) {
      // console.error('Error refreshing recently viewed products:', error);
    }
  }, []);

  return {
    recentlyViewed,
    addRecentlyViewed,
    clearRecentlyViewed,
    refreshRecentlyViewed,
    isLoaded, // Useful for preventing flash of no content during SSR
    hasRecentlyViewed: recentlyViewed.length > 0
  };
};

export default useRecentlyViewed; 