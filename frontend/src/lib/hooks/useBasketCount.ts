import { useQuery } from 'react-query';
import { getBasketCount } from '../api/bitrix';

export interface UseBasketCountOptions {
  /**
   * If true, will not automatically start the query
   */
  enabled?: boolean;
  
  /**
   * Polling interval in milliseconds
   * Set to 0 to disable polling
   */
  pollingInterval?: number;
  
  /**
   * Stale time in milliseconds
   * How long the data remains "fresh"
   */
  staleTime?: number;
  
  /**
   * Cache time in milliseconds
   * How long the data remains in the cache
   */
  cacheTime?: number;
  
  /**
   * If true, query will refetch on window focus
   */
  refetchOnWindowFocus?: boolean;

  /**
   * If true, will use mock data instead of real API
   */
  useMock?: boolean;
  
  /**
   * Mock data to use when useMock is true
   */
  mockData?: number;
}

/**
 * Mocked implementation of getBasketCount
 */
const getMockBasketCount = async (mockData: number = 5): Promise<number> => {
  console.log('Using mocked basket count:', mockData);
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 700));
  return mockData;
};

/**
 * Hook to fetch and cache the basket count from the Bitrix backend
 * Can be switched to use mock data for development
 */
export function useBasketCount(options: UseBasketCountOptions = {}) {
  const {
    enabled = true,
    pollingInterval = 0,
    staleTime = 1000 * 60 * 2, // 2 minutes
    cacheTime = 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus = true,
    useMock = process.env.NEXT_PUBLIC_USE_MOCKS === 'true', // Использовать моки по умолчанию, если включено в env
    mockData = 5, // Мок данные по умолчанию
  } = options;
  
  // Выбираем, какую функцию использовать - реальную или мок
  const fetchFunction = useMock 
    ? () => getMockBasketCount(mockData)
    : getBasketCount;
  
  return useQuery(
    // Добавляем к ключу префикс 'mock' если используются моки,
    // чтобы кэши не перепутались
    useMock ? ['basketCount', 'mock'] : 'basketCount', 
    fetchFunction,
    {
      enabled,
      staleTime,
      cacheTime,
      refetchOnWindowFocus,
      refetchInterval: pollingInterval > 0 ? pollingInterval : false,
      onError: (error) => {
        console.error('Failed to fetch basket count', error);
      },
      retry: 2, // Retry failed requests twice
    }
  );
} 