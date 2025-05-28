import { useQuery, useMutation, useQueryClient } from 'react-query';
import { 
  getBasketCountResponse, 
  addToBasketItem as apiAddToBasket, 
  updateBasketItem as apiUpdateBasketItem, 
  removeFromBasket as apiRemoveFromBasket, 
  clearBasket as apiClearBasket 
} from '../lib/api/bitrix';

// Хук для получения количества товаров в корзине
export const useBasketCount = (options = {}) => {
  const {
    useMock = true, // В режиме разработки используем моки по умолчанию
    mockData = 5,
    refetchOnWindowFocus = false,
    staleTime = 60000 // 1 минута
  } = options;

  // Функция для имитации запроса к бэкенду
  const fetchBasketCount = async () => {
    if (useMock) {
      console.log('Using mock basket count:', mockData);
      return mockData;
    }

    // В реальном приложении здесь был бы запрос к API
    try {
      // Для тестирования вернем фиксированное значение
      return mockData;
    } catch (error) {
      console.error('Error fetching basket count:', error);
      return 0;
    }
  };

  const { data, isLoading, error } = useQuery(
    ['basketCount', useMock ? 'mock' : 'real'],
    fetchBasketCount,
    {
      refetchOnWindowFocus,
      staleTime
    }
  );

  return {
    data, // Количество товаров
    isLoading,
    error
  };
};

// Хук для операций с корзиной
export const useBasketOperations = () => {
  const queryClient = useQueryClient();

  // Обновление кэша количества товаров после операций
  const invalidateBasketQueries = () => {
    queryClient.invalidateQueries('basketCount');
    queryClient.invalidateQueries('basketItems');
  };

  // Добавление товара в корзину
  const addToBasketMutation = useMutation(
    ({ productId, quantity }) => apiAddToBasket(productId, quantity),
    {
      onSuccess: () => invalidateBasketQueries(),
    }
  );

  // Обновление количества товара в корзине
  const updateBasketItemMutation = useMutation(
    ({ productId, quantity }) => apiUpdateBasketItem(productId, quantity),
    {
      onSuccess: () => invalidateBasketQueries(),
    }
  );

  // Удаление товара из корзины
  const removeFromBasketMutation = useMutation(
    (productId) => apiRemoveFromBasket(productId),
    {
      onSuccess: () => invalidateBasketQueries(),
    }
  );

  // Очистка корзины
  const clearBasketMutation = useMutation(
    apiClearBasket,
    {
      onSuccess: () => invalidateBasketQueries(),
    }
  );

  return {
    addItemToBasket: addToBasketMutation.mutate,
    updateBasketItem: updateBasketItemMutation.mutate,
    removeFromBasket: removeFromBasketMutation.mutate,
    clearBasket: clearBasketMutation.mutate,
    isLoading: 
      addToBasketMutation.isLoading || 
      updateBasketItemMutation.isLoading || 
      removeFromBasketMutation.isLoading || 
      clearBasketMutation.isLoading
  };
}; 