import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  getBasket,
  addToBasket,
  updateBasketItemQuantity,
  removeFromBasket,
  clearBasket
} from '../lib/api/bitrix';

/**
 * Hook to fetch and manage basket data
 * @param {Object} options - Configuration options
 * @param {boolean} options.initialFetch - Whether to fetch basket data on mount
 * @param {boolean} options.refetchOnWindowFocus - Whether to refetch when window gains focus
 * @param {number} options.staleTime - Time in ms before data is considered stale
 * @returns {Object} Basket data and operations
 */
export const useBasket = (options = {}) => {
  const {
    initialFetch = true,
    refetchOnWindowFocus = false,
    staleTime = 60000, // 1 minute
    format = 'full' // 'full' or 'compact'
  } = options;

  const queryClient = useQueryClient();

  // Function to fetch basket data
  const fetchBasket = async () => {
    try {
      const response = await getBasket({ format });
      console.log('Fetched basket data:', response);
      return response.basket || { items: [], summary: { count: 0, quantity: 0 } };
    } catch (error) {
      console.error('Error fetching basket data:', error);
      return { items: [], summary: { count: 0, quantity: 0 } };
    }
  };

  // Query for basket data
  const { 
    data: basketData, 
    isLoading: isLoadingBasket, 
    error: basketError,
    refetch: refetchBasket
  } = useQuery(
    ['basket', format],
    fetchBasket,
    {
      enabled: initialFetch,
      refetchOnWindowFocus,
      staleTime,
      onError: (error) => {
        console.error('Basket query error:', error);
      }
    }
  );

  // Invalidate basket queries to refresh data
  const invalidateBasketQueries = () => {
    queryClient.invalidateQueries(['basket']);
  };

  // Add item to basket mutation
  const addToBasketMutation = useMutation(
    (productData) => addToBasket(productData),
    {
      onSuccess: (data) => {
        console.log('Item added to basket:', data);
        invalidateBasketQueries();
      },
      onError: (error) => {
        console.error('Error adding item to basket:', error);
      }
    }
  );

  // Update basket item quantity mutation
  const updateBasketItemMutation = useMutation(
    (updateData) => updateBasketItemQuantity(updateData),
    {
      onSuccess: (data) => {
        console.log('Basket item updated:', data);
        invalidateBasketQueries();
      },
      onError: (error) => {
        console.error('Error updating basket item:', error);
      }
    }
  );

  // Remove item from basket mutation
  const removeFromBasketMutation = useMutation(
    (removeData) => removeFromBasket(removeData),
    {
      onSuccess: (data) => {
        console.log('Item removed from basket:', data);
        invalidateBasketQueries();
      },
      onError: (error) => {
        console.error('Error removing item from basket:', error);
      }
    }
  );

  // Clear basket mutation
  const clearBasketMutation = useMutation(
    () => clearBasket(),
    {
      onSuccess: (data) => {
        console.log('Basket cleared:', data);
        invalidateBasketQueries();
      },
      onError: (error) => {
        console.error('Error clearing basket:', error);
      }
    }
  );

  // Get basket count (items count, not quantity)
  const basketCount = basketData?.summary?.count || 0;
  const basketQuantity = basketData?.summary?.quantity || 0;
  const basketItems = basketData?.items || [];
  const basketTotalPrice = basketData?.summary?.total_price || 0;

  return {
    // Basket data
    basketData,
    basketItems,
    basketCount,
    basketQuantity,
    basketTotalPrice,
    
    // Loading and error states
    isLoading: isLoadingBasket || 
               addToBasketMutation.isLoading || 
               updateBasketItemMutation.isLoading || 
               removeFromBasketMutation.isLoading || 
               clearBasketMutation.isLoading,
    error: basketError, 
    
    // Operations
    refetchBasket,
    addToBasket: (productData) => {
      // Ensure product_id is a number
      if (productData.product_id) {
        productData.product_id = parseInt(productData.product_id, 10);
      }
      addToBasketMutation.mutate(productData);
    },
    updateBasketItem: (basketItemId, quantity) => 
      updateBasketItemMutation.mutate({ basket_item_id: parseInt(basketItemId, 10), quantity }),
    removeFromBasket: (basketItemId) => 
      removeFromBasketMutation.mutate({ basket_item_id: parseInt(basketItemId, 10) }),
    clearBasket: () => clearBasketMutation.mutate()
  };
};

/**
 * Simple hook to get just the basket count
 * Useful for components that only need to display the count (e.g. header)
 */
export const useBasketCount = (options = {}) => {
  const { basketCount, isLoading, error } = useBasket({
    ...options,
    format: 'compact' // Use compact format for efficiency
  });

  return {
    count: basketCount,
    isLoading,
    error
  };
}; 