/**
 * Mock implementations for Bitrix API functions
 * Used for development and testing
 */

import { BasketCountResponse, BasketHandlerResponse } from './bitrix';

// ==========================================================================
// Mocked State Management
// ==========================================================================

// Simulated basket state
let mockBasket: { id: string | number; quantity: number }[] = [];

// ==========================================================================
// Basket Mock Functions
// ==========================================================================

/**
 * Mock implementation for getBasketCount
 */
export const mockGetBasketCount = async (defaultCount?: number): Promise<number> => {
  if (defaultCount !== undefined) {
    console.log('Using fixed mocked basket count:', defaultCount);
    return defaultCount;
  }

  console.log('Using dynamic mocked basket count:', mockBasket.length);
  return mockBasket.length;
};

/**
 * Mock implementation for getBasketCountResponse
 */
export const mockGetBasketCountResponse = async (defaultCount?: number): Promise<BasketCountResponse> => {
  return {
    count: await mockGetBasketCount(defaultCount),
    status: true
  };
};

/**
 * Mock implementation for addToBasket
 */
export const mockAddToBasket = async (
  productId: string | number, 
  quantity: number = 1
): Promise<BasketHandlerResponse> => {
  console.log(`Mock: Adding ${quantity} of product ${productId} to basket`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Check if product already exists
  const existingIndex = mockBasket.findIndex(item => item.id === productId);
  
  if (existingIndex >= 0) {
    // Update quantity if product exists
    mockBasket[existingIndex].quantity += quantity;
  } else {
    // Add new product
    mockBasket.push({ id: productId, quantity });
  }
  
  return {
    status: true,
    method: 'add'
  };
};

/**
 * Mock implementation for updateBasketItem
 */
export const mockUpdateBasketItem = async (
  productId: string | number, 
  quantity: number
): Promise<BasketHandlerResponse> => {
  console.log(`Mock: Updating product ${productId} quantity to ${quantity}`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Find product
  const existingIndex = mockBasket.findIndex(item => item.id === productId);
  
  if (existingIndex >= 0) {
    // Update quantity
    mockBasket[existingIndex].quantity = quantity;
    return {
      status: true,
      method: 'update'
    };
  }
  
  // Product not found
  return {
    status: false,
    method: 'update'
  };
};

/**
 * Mock implementation for removeFromBasket
 */
export const mockRemoveFromBasket = async (
  productId: string | number
): Promise<BasketHandlerResponse> => {
  console.log(`Mock: Removing product ${productId} from basket`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Filter out the product
  const initialLength = mockBasket.length;
  mockBasket = mockBasket.filter(item => item.id !== productId);
  
  return {
    status: initialLength !== mockBasket.length,
    method: 'delete'
  };
};

/**
 * Mock implementation for clearBasket
 */
export const mockClearBasket = async (): Promise<BasketHandlerResponse> => {
  console.log('Mock: Clearing basket');
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Clear basket
  mockBasket = [];
  
  return {
    status: true,
    method: 'deleteAll'
  };
};

// ==========================================================================
// Mock Utils
// ==========================================================================

/**
 * Reset all mock state
 * Useful for testing and storybook
 */
export const resetMockState = (): void => {
  mockBasket = [];
};

/**
 * Get current mock basket state
 * Useful for debugging
 */
export const getMockBasketState = (): typeof mockBasket => {
  return [...mockBasket];
}; 