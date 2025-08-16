import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useState, useEffect, useCallback } from 'react';
import { 
  getBasket,
  addToBasket,
  updateBasketItemQuantity,
  removeFromBasket,
  clearBasket,
  checkStock
} from '../lib/api/bitrix';
import {
  getStoredFuserId,
  storeFuserId,
  getOrInitializeFuserId,
  validateAndRefreshFuserId
} from '../lib/basketUtils';

/**
 * Hook to fetch and manage basket data with persistent fuser_id
 * This hook ensures that the user's basket persists across sessions
 * by maintaining a fuser_id in localStorage
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.initialFetch - Whether to fetch basket data on mount
 * @param {boolean} options.refetchOnWindowFocus - Whether to refetch when window gains focus
 * @param {number} options.staleTime - Time in ms before data is considered stale
 * @param {string} options.format - Response format: 'full', 'compact', 'minimal'
 * @param {boolean} options.autoInitialize - Whether to auto-initialize fuser_id
 * @returns {Object} Basket data and operations
 */
export const useBasket = (options = {}) => {
  const {
    initialFetch = true,
    refetchOnWindowFocus = false,
    staleTime = 60000, // 1 minute
    format = 'full', // 'full', 'compact', or 'minimal'
    autoInitialize = true
  } = options;

  const queryClient = useQueryClient();
  
  // State to track the current fuser_id
  const [fuserId, setFuserId] = useState(null);
  const [isFuserIdInitialized, setIsFuserIdInitialized] = useState(false);

  // Initialize fuser_id on component mount
  useEffect(() => {
    const initializeFuserId = async () => {
      try {
        // First check if we have a stored fuser_id
        const storedId = getStoredFuserId();
        
        if (storedId) {
          // console.log('Found stored fuser_id:', storedId);
          setFuserId(storedId);
          setIsFuserIdInitialized(true);
        } else if (autoInitialize) {
          // console.log('No stored fuser_id, will initialize on first basket request');
          setIsFuserIdInitialized(true);
        } else {
          // console.log('fuser_id auto-initialization disabled');
          setIsFuserIdInitialized(true);
        }
      } catch (error) {
        // console.error('Failed to initialize fuser_id:', error);
        setIsFuserIdInitialized(true);
      }
    };

    if (typeof window !== 'undefined') {
      initializeFuserId();
    } else {
      // Server-side rendering
      setIsFuserIdInitialized(true);
    }
  }, [autoInitialize]);

  // Function to ensure we have a valid fuser_id
  const ensureFuserId = useCallback(async () => {
    if (fuserId) {
      return fuserId;
    }

    try {
      const newFuserId = await getOrInitializeFuserId(getBasket);
      if (newFuserId) {
        setFuserId(newFuserId);
        return newFuserId;
      }
      throw new Error('Failed to obtain fuser_id');
    } catch (error) {
      // console.error('Failed to ensure fuser_id:', error);
      return null;
    }
  }, [fuserId]);

  // Function to fetch basket data
  const fetchBasket = async () => {
    try {
      // console.log('🔄 [useBasket] Starting fetchBasket...');
      
      const currentFuserId = await ensureFuserId();
      
      if (!currentFuserId) {
        // console.warn('⚠️ [useBasket] No fuser_id available, returning empty basket');
        return { 
          basket: { 
            items: { items: [], summary: { count: 0, quantity: 0, total_price: 0 } },
            summary: { count: 0, quantity: 0, total_price: 0 }
          },
          meta: { fuser_id: null }
        };
      }

      // console.log('✅ [useBasket] Using fuser_id for fetch:', currentFuserId);
      
      const requestParams = { 
        fuser_id: currentFuserId, 
        format 
      };
      
      // console.log('📤 [useBasket] Fetching basket with params:', requestParams);

      const response = await getBasket(requestParams);
      
      // console.log('📥 [useBasket] Fetched basket response:', response);
      
      // Update fuser_id if the server returns a different one
      if (response?.meta?.fuser_id && response.meta.fuser_id !== currentFuserId) {
        const newFuserId = String(response.meta.fuser_id);
        // console.log(`🔄 [useBasket] Updating fuser_id from ${currentFuserId} to ${newFuserId}`);
        storeFuserId(newFuserId);
        setFuserId(newFuserId);
      }
      
      // Log basket items for debugging
      if (response?.basket?.items?.items) {
        // console.log('📦 [useBasket] Basket items:', response.basket.items.items);
        // console.log('📊 [useBasket] Basket summary:', response.basket.summary);
      }
      
      return response;
    } catch (error) {
      // console.error('❌ [useBasket] Error fetching basket data:', error);
      // Return empty basket structure on error
      return { 
        basket: { 
          items: { items: [], summary: { count: 0, quantity: 0, total_price: 0 } },
          summary: { count: 0, quantity: 0, total_price: 0 }
        },
        meta: { fuser_id: fuserId }
      };
    }
  };

  // Query for basket data
  const { 
    data: basketResponse, 
    isLoading: isLoadingBasket, 
    error: basketError,
    refetch: refetchBasket
  } = useQuery(
    ['basket', format, fuserId],
    fetchBasket,
    {
      enabled: initialFetch && isFuserIdInitialized,
      refetchOnWindowFocus,
      staleTime,
      onError: (error) => {
        // console.error('Basket query error:', error);
      }
    }
  );

  // Extract basket data from response
  const basketData = basketResponse?.basket || { 
    items: { items: [], summary: { count: 0, quantity: 0, total_price: 0 } },
    summary: { count: 0, quantity: 0, total_price: 0 }
  };

  // Invalidate basket queries to refresh data
  const invalidateBasketQueries = useCallback(() => {
    // console.log('🔄 [useBasket] Invalidating basket queries to trigger refresh...');
    queryClient.invalidateQueries(['basket']);
    // console.log('✅ [useBasket] Basket queries invalidated');
  }, [queryClient]);

  // Add item to basket mutation
  const addToBasketMutation = useMutation(
    async (productData) => {
      // console.log('🔄 [useBasket] Starting addToBasket mutation:', productData);
      
      const currentFuserId = await ensureFuserId();
      if (!currentFuserId) {
        // console.error('❌ [useBasket] Cannot add to basket: fuser_id not available');
        throw new Error('Cannot add to basket: fuser_id not available');
      }
      
      // console.log('✅ [useBasket] Using fuser_id for add operation:', currentFuserId);
      
      const requestData = {
        ...productData,
        fuser_id: currentFuserId
      };
      
      // console.log('📤 [useBasket] Sending add request with data:', requestData);
      
      return addToBasket(requestData);
    },
    {
      onSuccess: (data) => {
        // console.log('✅ [useBasket] Item added to basket successfully:', data);
        // console.log('🔄 [useBasket] Invalidating basket queries...');
        invalidateBasketQueries();
      },
      onError: (error) => {
        // console.error('❌ [useBasket] Error adding item to basket:', error);
      }
    }
  );

  // Add item to basket with pre-check stock mutation  
  const addToBasketWithStockCheckMutation = useMutation(
    async (productData) => {
      // console.log('🔄 [useBasket] Starting addToBasket with stock check:', productData);
      
      const { product_id, quantity = 1 } = productData;
      
      // First check stock availability
      // console.log('🔍 [useBasket] Checking stock before adding to basket:', { product_id, quantity });
      const stockResponse = await checkStock({ product_id, quantity });
      
      if (!stockResponse.success || !stockResponse.available) {
        const error = new Error(stockResponse.error || 'Недостаточно товара на складе');
        error.stockResponse = stockResponse;
        throw error;
      }
      
      // console.log('✅ [useBasket] Stock check passed, proceeding to add item');
      
      // If stock check passes, add to basket
      const currentFuserId = await ensureFuserId();
      if (!currentFuserId) {
        throw new Error('Cannot add to basket: fuser_id not available');
      }
      
      const requestData = {
        ...productData,
        fuser_id: currentFuserId
      };
      
      return addToBasket(requestData);
    },
    {
      onSuccess: (data) => {
        // console.log('✅ [useBasket] Item added to basket successfully with stock check:', data);
        invalidateBasketQueries();
      },
      onError: (error) => {
        // console.error('❌ [useBasket] Error adding item to basket with stock check:', error);
      }
    }
  );

  // Update basket item quantity mutation
  const updateBasketItemMutation = useMutation(
    async (updateData) => {
      // console.log('🔄 [useBasket] Starting updateBasketItem mutation:', updateData);
      
      const currentFuserId = await ensureFuserId();
      if (!currentFuserId) {
        // console.error('❌ [useBasket] Cannot update basket item: fuser_id not available');
        throw new Error('Cannot update basket item: fuser_id not available');
      }
      
      // console.log('✅ [useBasket] Using fuser_id for update operation:', currentFuserId);
      
      const requestData = {
        ...updateData,
        fuser_id: currentFuserId
      };
      
      // console.log('📤 [useBasket] Sending update request with data:', requestData);
      
      return updateBasketItemQuantity(requestData);
    },
    {
      onSuccess: (data) => {
        // console.log('✅ [useBasket] Basket item updated successfully:', data);
        // console.log('🔄 [useBasket] Invalidating basket queries...');
        invalidateBasketQueries();
      },
      onError: (error) => {
        // console.error('❌ [useBasket] Error updating basket item:', error);
      }
    }
  );

  // Remove item from basket mutation
  const removeFromBasketMutation = useMutation(
    async (removeData) => {
      // console.log('🔄 [useBasket] Starting removeFromBasket mutation:', removeData);
      
      const currentFuserId = await ensureFuserId();
      if (!currentFuserId) {
        // console.error('❌ [useBasket] Cannot remove from basket: fuser_id not available');
        throw new Error('Cannot remove from basket: fuser_id not available');
      }
      
      // console.log('✅ [useBasket] Using fuser_id for remove operation:', currentFuserId);
      
      const requestData = {
        ...removeData,
        fuser_id: currentFuserId
      };
      
      // console.log('📤 [useBasket] Sending remove request with data:', requestData);
      
      return removeFromBasket(requestData);
    },
    {
      onSuccess: (data) => {
        // console.log('✅ [useBasket] Item removed from basket successfully:', data);
        // console.log('🔄 [useBasket] Invalidating basket queries...');
        invalidateBasketQueries();
      },
      onError: (error) => {
        // console.error('❌ [useBasket] Error removing item from basket:', error);
      }
    }
  );

  // Clear basket mutation
  const clearBasketMutation = useMutation(
    async () => {
      const currentFuserId = await ensureFuserId();
      if (!currentFuserId) {
        throw new Error('Cannot clear basket: fuser_id not available');
      }
      
      return clearBasket(currentFuserId);
    },
    {
      onSuccess: (data) => {
        // console.log('Basket cleared:', data);
        invalidateBasketQueries();
      },
      onError: (error) => {
        // console.error('Error clearing basket:', error);
      }
    }
  );

  // Check stock mutation
  const checkStockMutation = useMutation(
    (stockData) => checkStock(stockData),
    {
      onError: (error) => {
        // console.error('Error checking stock:', error);
      }
    }
  );

  // Extract basket metrics
  const basketItems = basketData?.items?.items || [];
  
  // Log basket data for debugging
  // console.log('🔍 [useBasket] Raw basketData:', basketData);
  // console.log('🔍 [useBasket] Extracted basketItems:', basketItems);
  
  const basketSummary = basketData?.summary || basketData?.items?.summary || { 
    count: 0, 
    quantity: 0, 
    total_price: 0 
  };
  const basketCount = basketSummary.count || 0;
  const basketQuantity = basketSummary.quantity || 0;
  const basketTotalPrice = basketSummary.total_price || 0;

  // Check if any operation is loading
  const isLoading = isLoadingBasket || 
                   addToBasketMutation.isLoading || 
                   addToBasketWithStockCheckMutation.isLoading ||
                   updateBasketItemMutation.isLoading || 
                   removeFromBasketMutation.isLoading || 
                   clearBasketMutation.isLoading ||
                   checkStockMutation.isLoading;

  return {
    // Basket data
    basketData,
    basketItems,
    basketCount,
    basketQuantity,
    basketTotalPrice,
    basketSummary,
    
    // fuser_id info
    fuserId,
    isFuserIdInitialized,
    
    // Loading and error states
    isLoading,
    error: basketError,
    
    // Operations
    refetchBasket: useCallback(() => {
      if (isFuserIdInitialized) {
        refetchBasket();
      }
    }, [refetchBasket, isFuserIdInitialized]),
    
    addToBasket: useCallback((productData) => {
      // Ensure product_id is a number
      if (productData.product_id) {
        productData.product_id = parseInt(productData.product_id, 10);
      }
      return addToBasketMutation.mutateAsync(productData);
    }, [addToBasketMutation]),

    addToBasketWithStockCheck: useCallback((productData) => {
      // Ensure product_id is a number
      if (productData.product_id) {
        productData.product_id = parseInt(productData.product_id, 10);
      }
      return addToBasketWithStockCheckMutation.mutateAsync(productData);
    }, [addToBasketWithStockCheckMutation]),
    
    updateBasketItem: useCallback((basketItemId, quantity, properties = undefined) => {
      const updateData = { 
        basket_item_id: parseInt(basketItemId, 10), 
        quantity: parseInt(quantity, 10)
      };
      if (properties) {
        updateData.properties = properties;
      }
      return updateBasketItemMutation.mutateAsync(updateData);
    }, [updateBasketItemMutation]),
    
    removeFromBasket: useCallback((basketItemId) => {
      return removeFromBasketMutation.mutateAsync({ 
        basket_item_id: parseInt(basketItemId, 10) 
      });
    }, [removeFromBasketMutation]),
    
    clearBasket: useCallback(() => {
      return clearBasketMutation.mutateAsync();
    }, [clearBasketMutation]),
    
    checkStock: useCallback((productId, quantity) => {
      return checkStockMutation.mutateAsync({
        product_id: parseInt(productId, 10),
        quantity: parseInt(quantity, 10)
      });
    }, [checkStockMutation]),
    
    // Utility functions
    ensureFuserId
  };
};

/**
 * Simple hook to get just the basket count
 * Useful for components that only need to display the count (e.g. header)
 */
export const useBasketCount = (options = {}) => {
  const { basketCount, isLoading, error, isFuserIdInitialized } = useBasket({
    ...options,
    format: 'compact' // Use compact format for efficiency
  });

  return {
    count: basketCount,
    isLoading,
    error,
    isInitialized: isFuserIdInitialized
  };
}; 