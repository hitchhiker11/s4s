import { QueryClient } from 'react-query';

// Настройки для QueryClient по умолчанию
const defaultOptions = {
  queries: {
    retry: 1, // Повторять запросы 1 раз при ошибке
    staleTime: 30000, // Данные стареют через 30 секунд
    cacheTime: 300000, // Кеш хранится 5 минут
    refetchOnWindowFocus: false, // Не обновлять при фокусе окна по умолчанию
    refetchOnReconnect: true, // Обновлять при восстановлении соединения
  },
  mutations: {
    retry: 1,
  },
};

/**
 * Создаёт экземпляр QueryClient с настроенными параметрами
 * @param {Object} options - Пользовательские настройки для QueryClient
 * @returns {QueryClient} - Настроенный экземпляр QueryClient
 */
export const createQueryClient = (customOptions = {}) => {
  return new QueryClient({
    defaultOptions: {
      ...defaultOptions,
      ...customOptions,
    },
  });
};

// Экспортируем готовый экземпляр клиента для использования в приложении
export const queryClient = createQueryClient();

// Для тестов можно создать отдельный экземпляр
export const createTestQueryClient = () => createQueryClient({
  queries: {
    retry: false,
  },
}); 