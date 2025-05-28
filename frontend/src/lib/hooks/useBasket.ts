import { useMutation, useQueryClient } from 'react-query';
import { 
  addToBasket, 
  updateBasketItem, 
  removeFromBasket, 
  clearBasket 
} from '../api/bitrix';
import { 
  mockAddToBasket, 
  mockUpdateBasketItem, 
  mockRemoveFromBasket, 
  mockClearBasket 
} from '../api/mocks';

export interface UseBasketOptions {
  /**
   * If true, will use mock data instead of real API
   */
  useMock?: boolean;
  
  /**
   * Called after successful add to basket operation
   */
  onAddSuccess?: (productId: string | number, quantity: number) => void;
  
  /**
   * Called after successful update operation
   */
  onUpdateSuccess?: (productId: string | number, quantity: number) => void;
  
  /**
   * Called after successful remove operation
   */
  onRemoveSuccess?: (productId: string | number) => void;
  
  /**
   * Called after successful clear operation
   */
  onClearSuccess?: () => void;
  
  /**
   * Called after any error
   */
  onError?: (error: any, operationType: 'add' | 'update' | 'remove' | 'clear') => void;
}

/**
 * Hook to work with basket CRUD operations
 * Handles mutations and cache invalidation
 */
export function useBasket(options: UseBasketOptions = {}) {
  const {
    useMock = process.env.NEXT_PUBLIC_USE_MOCKS === 'true',
    onAddSuccess,
    onUpdateSuccess,
    onRemoveSuccess,
    onClearSuccess,
    onError
  } = options;
  
  const queryClient = useQueryClient();
  
  // Invalidate the basketCount query to trigger a refresh of basket count
  const invalidateBasketCount = () => {
    const queryKey = useMock ? ['basketCount', 'mock'] : 'basketCount';
    queryClient.invalidateQueries(queryKey);
  };
  
  // Add to basket mutation
  const addMutation = useMutation(
    ({ productId, quantity }: { productId: string | number; quantity: number }) => 
      useMock 
        ? mockAddToBasket(productId, quantity)
        : addToBasket(productId, quantity),
    {
      onSuccess: (_, variables) => {
        invalidateBasketCount();
        onAddSuccess?.(variables.productId, variables.quantity);
      },
      onError: (error) => {
        onError?.(error, 'add');
      }
    }
  );
  
  // Update basket item mutation
  const updateMutation = useMutation(
    ({ productId, quantity }: { productId: string | number; quantity: number }) => 
      useMock
        ? mockUpdateBasketItem(productId, quantity)
        : updateBasketItem(productId, quantity),
    {
      onSuccess: (_, variables) => {
        invalidateBasketCount();
        onUpdateSuccess?.(variables.productId, variables.quantity);
      },
      onError: (error) => {
        onError?.(error, 'update');
      }
    }
  );
  
  // Remove from basket mutation
  const removeMutation = useMutation(
    (productId: string | number) => 
      useMock
        ? mockRemoveFromBasket(productId)
        : removeFromBasket(productId),
    {
      onSuccess: (_, productId) => {
        invalidateBasketCount();
        onRemoveSuccess?.(productId);
      },
      onError: (error) => {
        onError?.(error, 'remove');
      }
    }
  );
  
  // Clear basket mutation
  const clearMutation = useMutation(
    () => useMock ? mockClearBasket() : clearBasket(),
    {
      onSuccess: () => {
        invalidateBasketCount();
        onClearSuccess?.();
      },
      onError: (error) => {
        onError?.(error, 'clear');
      }
    }
  );
  
  return {
    // Add to basket
    addToBasket: (productId: string | number, quantity: number = 1) => 
      addMutation.mutate({ productId, quantity }),
    isAddingToBasket: addMutation.isLoading,
    
    // Update basket item
    updateBasketItem: (productId: string | number, quantity: number) => 
      updateMutation.mutate({ productId, quantity }),
    isUpdatingBasket: updateMutation.isLoading,
    
    // Remove from basket
    removeFromBasket: (productId: string | number) => 
      removeMutation.mutate(productId),
    isRemovingFromBasket: removeMutation.isLoading,
    
    // Clear basket
    clearBasket: () => clearMutation.mutate(),
    isClearingBasket: clearMutation.isLoading,
    
    // Overall loading state
    isLoading: addMutation.isLoading || 
               updateMutation.isLoading || 
               removeMutation.isLoading || 
               clearMutation.isLoading
  };
} 