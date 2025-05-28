import { z } from 'zod';

// Type definition to resolve the "Cannot find name 'process'" error
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_BITRIX_URL?: string;
      [key: string]: string | undefined;
    }
  }
  var process: {
    env: {
      NEXT_PUBLIC_BITRIX_URL?: string;
      [key: string]: string | undefined;
    }
  };
}

// Base Bitrix API configuration
const BITRIX_URL = process.env.NEXT_PUBLIC_BITRIX_URL || 'https://s4s.local/bitrix/';

// Common API types
export type CacheStrategy = 'stale-while-revalidate' | 'force-cache' | 'no-cache';

export interface BitrixAdaptor<T, S extends z.ZodType<T>> {
  endpoint: string;
  validationSchema: S;
  cacheStrategy: CacheStrategy;
  fetchOptions?: RequestInit;
}

// ==========================================================================
// Response schemas for runtime validation
// ==========================================================================

// Basket Count Response
export const BasketCountSchema = z.object({
  count: z.number(),
  status: z.boolean()
});

export type BasketCountResponse = z.infer<typeof BasketCountSchema>;

// Basket Handler Response
export const BasketHandlerSchema = z.object({
  status: z.boolean(),
  method: z.string().optional()
});

export type BasketHandlerResponse = z.infer<typeof BasketHandlerSchema>;

// ==========================================================================
// API Adaptors
// ==========================================================================

// Basket Count Adaptor
export const basketCountAdaptor: BitrixAdaptor<BasketCountResponse, typeof BasketCountSchema> = {
  endpoint: `${BITRIX_URL}ajax/getProductCountInBasket.php`,
  validationSchema: BasketCountSchema,
  cacheStrategy: 'stale-while-revalidate',
  fetchOptions: {
    credentials: 'include', // To ensure cookies are sent for auth
  }
};

// Basket Handler Adaptor
export const basketHandlerAdaptor: BitrixAdaptor<BasketHandlerResponse, typeof BasketHandlerSchema> = {
  endpoint: `${BITRIX_URL}ajax/catalog/basketHandler.php`,
  validationSchema: BasketHandlerSchema,
  cacheStrategy: 'no-cache', // Не кэшируем операции изменения корзины
  fetchOptions: {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  }
};

// ==========================================================================
// Generic API functions
// ==========================================================================

/**
 * Generic function to fetch data from Bitrix endpoints with validation and error handling
 */
export async function fetchFromBitrix<T, S extends z.ZodType<T>>(
  adaptor: BitrixAdaptor<T, S>,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(adaptor.endpoint, {
      ...adaptor.fetchOptions,
      ...options,
      headers: {
        ...(adaptor.fetchOptions?.headers || {}),
        ...(options?.headers || {})
      },
      // Apply the cache strategy
      cache: adaptor.cacheStrategy === 'stale-while-revalidate' 
        ? undefined // Let SWR/React-Query handle this
        : adaptor.cacheStrategy
    });

    if (!response.ok) {
      throw new Error(`Bitrix API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate the response against our schema
    const validated = adaptor.validationSchema.parse(data);
    return validated;
  } catch (error) {
    console.error('Error fetching from Bitrix API:', error);
    throw error;
  }
}

// ==========================================================================
// Basket specific API functions
// ==========================================================================

/**
 * Get the number of items in the basket
 */
export async function getBasketCount(): Promise<number> {
  const data = await fetchFromBitrix(basketCountAdaptor);
  return data.count;
}

/**
 * Add an item to the basket
 * @param productId - ID of the product to add
 * @param quantity - Quantity to add (default: 1)
 */
export const addToBasketItem = async (
  productId: string | number, 
  quantity: number = 1
): Promise<BasketHandlerResponse> => {
  // Тестовая реализация
  console.log(`Adding ${quantity} of product ${productId} to basket`);
  return {
    status: true,
    method: 'add'
  };
};

/**
 * Update the quantity of an item in the basket
 * @param productId - ID of the product to update
 * @param quantity - New quantity
 */
export async function updateBasketItem(productId: string | number, quantity: number): Promise<BasketHandlerResponse> {
  // Тестовая реализация
  console.log(`Updating product ${productId} quantity to ${quantity}`);
  return {
    status: true,
    method: 'update'
  };
}

/**
 * Remove an item from the basket
 * @param productId - ID of the product to remove
 */
export async function removeFromBasket(productId: string | number): Promise<BasketHandlerResponse> {
  // Тестовая реализация
  console.log(`Removing product ${productId} from basket`);
  return {
    status: true,
    method: 'delete'
  };
}

/**
 * Clear the entire basket
 */
export async function clearBasket(): Promise<BasketHandlerResponse> {
  // Тестовая реализация
  console.log('Clearing basket');
  return {
    status: true,
    method: 'deleteAll'
  };
}

// Получение количества товаров в корзине
export const getBasketCountResponse = async (): Promise<BasketCountResponse> => {
  try {
    // В реальном приложении здесь был бы запрос к API
    // Для тестирования вернем фиксированное значение
    return { count: 3, status: true };
  } catch (error) {
    console.error('Error fetching basket count:', error);
    return { count: 0, status: false };
  }
};

// Эти функции дублируют существующие и должны быть удалены
// Используйте функции removeFromBasket и clearBasket, определенные выше