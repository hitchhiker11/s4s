import { 
  aboutSliderMockData, 
  basketCountMockData,
  catalogMockData
} from './mockData';

/**
 * Утилита для имитации асинхронного запроса
 * @param {any} data - данные, которые нужно вернуть
 * @param {number} delay - задержка в миллисекундах
 * @param {boolean} shouldFail - должен ли запрос завершиться ошибкой
 * @returns {Promise}
 */
export const mockAsyncResponse = (data, delay = 500, shouldFail = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        reject(new Error('Ошибка при выполнении запроса'));
      } else {
        resolve(data);
      }
    }, delay);
  });
};

/**
 * Фабрика для создания мок-функций API
 * @param {string} endpoint - эндпоинт API
 * @param {any} mockData - данные для мокового ответа
 * @param {number} delay - задержка в миллисекундах
 * @returns {Function}
 */
export const createMockApiFunction = (endpoint, mockData, delay = 500) => {
  // Логирование для отладки
  console.log(`[MOCK API] Создан мок для эндпоинта ${endpoint}`);
  
  return async (...args) => {
    console.log(`[MOCK API] Запрос к ${endpoint}`, args);
    return mockAsyncResponse(mockData, delay);
  };
};

/**
 * Мок-реализации API-функций
 */
export const mockApi = {
  getAboutSliderData: createMockApiFunction(
    '/bitrix/ajax/getAboutSlider.php', 
    aboutSliderMockData
  ),
  
  getBasketCount: createMockApiFunction(
    '/bitrix/ajax/getProductCountInBasket.php', 
    basketCountMockData
  ),
  
  getCatalogData: createMockApiFunction(
    '/bitrix/ajax/getCatalog.php', 
    catalogMockData
  )
}; 