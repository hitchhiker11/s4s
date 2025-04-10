import { useQuery } from 'react-query';
import { getAboutSliderData } from '../api/bitrix';

/**
 * Получает данные для слайдера в секции About
 * @param {Object} options - дополнительные опции для useQuery
 * @returns {Object} результат выполнения запроса через react-query
 */
export const useAboutSliderData = (options = {}) => {
  return useQuery(
    ['aboutSliderData'],
    getAboutSliderData, // Используем функцию из API-клиента, которая уже содержит логику для моков
    {
      staleTime: 1000 * 60 * 5, // 5 минут
      cacheTime: 1000 * 60 * 30, // 30 минут
      refetchOnWindowFocus: false,
      retry: 2,
      ...options, // Можно переопределить настройки при вызове хука
    }
  );
}; 