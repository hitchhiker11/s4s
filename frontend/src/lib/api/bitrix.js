import axios from 'axios';
import { mockApi } from '../mocks/mockApi';

// Переменная, указывающая, используем ли мы моки
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

// Логируем режим работы при инициализации
if (USE_MOCKS) {
  console.log('[API] Работаем с мок-данными');
} else {
  console.log('[API] Работаем с реальным API');
}

/**
 * Создаем экземпляр Axios с базовыми настройками для запросов к Bitrix
 */
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BITRIX_URL || '',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // Важно для работы с сессией Bitrix
});

/**
 * Добавляем перехватчик запросов для добавления токена сессии Bitrix
 */
api.interceptors.request.use((config) => {
  // Если код исполняется в браузере и доступен глобальный объект Bitrix
  if (typeof window !== 'undefined' && window.BX && window.BX.bitrix_sessid) {
    config.headers['X-Bitrix-Sessid'] = window.BX.bitrix_sessid();
  }
  return config;
});

/**
 * Добавляем перехватчик ответов для обработки ошибок Bitrix
 */
api.interceptors.response.use(
  (response) => {
    // Если ответ от сервера содержит признак ошибки в формате Bitrix
    if (response.data && response.data.success === false) {
      return Promise.reject(new Error(response.data.message || 'Ошибка сервера Bitrix'));
    }
    return response;
  },
  (error) => {
    // Обработка HTTP-ошибок
    let errorMessage = 'Произошла ошибка при выполнении запроса';
    
    if (error.response) {
      // Ответ от сервера с ошибкой (4xx, 5xx)
      errorMessage = `Ошибка ${error.response.status}: ${error.response.data?.message || 'Ошибка сервера'}`;
    } else if (error.request) {
      // Запрос был отправлен, но ответ не получен
      errorMessage = 'Нет ответа от сервера Bitrix';
    }
    
    console.error('API Error:', errorMessage, error);
    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * Функция для получения количества товаров в корзине
 */
const getBasketCount = async () => {
  try {
    // Если используем моки, возвращаем мок-данные
    if (USE_MOCKS) {
      return await mockApi.getBasketCount();
    }
    
    // Иначе делаем реальный запрос
    const response = await api.get('/bitrix/ajax/getProductCountInBasket.php');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении количества товаров в корзине:', error);
    throw error;
  }
};

/**
 * Функция для получения данных слайдера на странице About
 */
const getAboutSliderData = async () => {
  try {
    // Если используем моки, возвращаем мок-данные
    if (USE_MOCKS) {
      return await mockApi.getAboutSliderData();
    }
    
    // Иначе делаем реальный запрос
    const response = await api.get('/bitrix/ajax/getAboutSlider.php');
    return response.data;
  } catch (error) {
    console.error('Ошибка при получении данных слайдера:', error);
    throw error;
  }
};

// Экспортируем API-клиент и методы
export { 
  api, 
  getBasketCount,
  getAboutSliderData,
  USE_MOCKS // Экспортируем флаг для использования в других модулях
}; 