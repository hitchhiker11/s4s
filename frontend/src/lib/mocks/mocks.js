/**
 * Вспомогательные функции для управления моками из консоли браузера
 * Эти функции помогают тестировать различные сценарии без изменения кода
 */

import { mockApi, mockAsyncResponse } from './mockApi';
import * as mockData from './mockData';

/**
 * Объект для глобального доступа из консоли браузера
 */
const MockTools = {
  // Оригинальные данные
  originalData: { ...mockData },
  
  // Текущие данные
  currentData: { ...mockData },
  
  // Функция для восстановления исходных данных
  resetMocks() {
    console.log('[MOCK] Восстановление исходных данных');
    this.currentData = { ...this.originalData };
    
    // Обновляем мок-функции
    this.updateMockApiFunctions();
    
    return 'Моки сброшены к исходным значениям';
  },
  
  // Функция для обновления данных конкретного мока
  updateMock(mockName, newData) {
    if (!this.currentData[mockName]) {
      console.error(`[MOCK] Мок ${mockName} не найден`);
      return `Ошибка: Мок ${mockName} не найден`;
    }
    
    console.log(`[MOCK] Обновление мока ${mockName}`);
    this.currentData[mockName] = {
      ...this.currentData[mockName],
      ...newData
    };
    
    // Обновляем мок-функции
    this.updateMockApiFunctions();
    
    return `Мок ${mockName} обновлен`;
  },
  
  // Функция для симуляции ошибки API
  simulateError(apiMethod, duration = 5000) {
    console.log(`[MOCK] Симуляция ошибки для метода ${apiMethod}`);
    
    // Создаем временную функцию, которая возвращает ошибку
    const originalMethod = mockApi[apiMethod];
    
    mockApi[apiMethod] = async (...args) => {
      return mockAsyncResponse(null, 500, true);
    };
    
    // Восстанавливаем оригинальную функцию через заданное время
    setTimeout(() => {
      console.log(`[MOCK] Восстановление нормальной работы метода ${apiMethod}`);
      mockApi[apiMethod] = originalMethod;
    }, duration);
    
    return `Симуляция ошибки для ${apiMethod} запущена на ${duration}ms`;
  },
  
  // Функция для симуляции задержки
  simulateDelay(apiMethod, delay = 3000, duration = 10000) {
    console.log(`[MOCK] Симуляция задержки ${delay}ms для метода ${apiMethod}`);
    
    // Запоминаем оригинальный метод
    const originalMethod = mockApi[apiMethod];
    
    // Переопределяем метод с задержкой
    mockApi[apiMethod] = async (...args) => {
      const data = await originalMethod(...args);
      return mockAsyncResponse(data, delay);
    };
    
    // Восстанавливаем оригинальный метод через заданное время
    setTimeout(() => {
      console.log(`[MOCK] Восстановление нормальной работы метода ${apiMethod}`);
      mockApi[apiMethod] = originalMethod;
    }, duration);
    
    return `Симуляция задержки ${delay}ms для ${apiMethod} запущена на ${duration}ms`;
  },
  
  // Обновление мок-функций с текущими данными
  updateMockApiFunctions() {
    // Здесь можно добавить логику для динамического обновления мок-функций
    console.log('[MOCK] Обновление мок-функций');
  },
  
  // Информация о доступных командах
  help() {
    return `
      Доступные команды:
      - MockTools.resetMocks() - сбросить все моки к исходным значениям
      - MockTools.updateMock('mockName', newData) - обновить данные конкретного мока
      - MockTools.simulateError('apiMethod', durationMs) - симулировать ошибку API
      - MockTools.simulateDelay('apiMethod', delayMs, durationMs) - симулировать задержку
      - MockTools.originalData - посмотреть исходные данные
      - MockTools.currentData - посмотреть текущие данные
      - MockTools.help() - показать эту справку
      
      Примеры:
      MockTools.updateMock('aboutSliderMockData', { success: false, message: 'Ошибка загрузки' })
      MockTools.simulateError('getAboutSliderData', 10000)
      MockTools.simulateDelay('getBasketCount', 5000, 30000)
    `;
  }
};

// Если код выполняется в браузере, добавляем API в глобальную область видимости
if (typeof window !== 'undefined') {
  window.MockTools = MockTools;
  console.log('[MOCK] Инструменты для работы с моками доступны через глобальный объект MockTools');
  console.log('[MOCK] Введите MockTools.help() для получения справки');
}

export default MockTools; 