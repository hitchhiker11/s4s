/**
 * Модуль для работы с аутентификацией и сессиями Bitrix
 */

// Проверка наличия токена сессии Bitrix
export const hasBitrixSession = () => {
  return typeof window !== 'undefined' && 
         window.BX && 
         typeof window.BX.bitrix_sessid === 'function';
};

// Получение текущего токена сессии
export const getBitrixSessionId = () => {
  if (hasBitrixSession()) {
    return window.BX.bitrix_sessid();
  }
  return null;
};

// Проверка авторизации пользователя в Bitrix
export const isUserAuthenticated = () => {
  return typeof window !== 'undefined' && 
         window.BX && 
         window.BX.message && 
         window.BX.message('USER_ID') && 
         parseInt(window.BX.message('USER_ID')) > 0;
};

// Получение ID текущего пользователя
export const getCurrentUserId = () => {
  if (isUserAuthenticated()) {
    return parseInt(window.BX.message('USER_ID'));
  }
  return null;
};

// Функция для передачи данных сессии с сервера в клиентский код
export const injectSessionData = (sessionData) => {
  if (typeof window !== 'undefined') {
    window.__BITRIX_SESSION_DATA__ = sessionData;
  }
};

// Функция для получения данных сессии в клиентском коде
export const getSessionData = () => {
  if (typeof window !== 'undefined' && window.__BITRIX_SESSION_DATA__) {
    return window.__BITRIX_SESSION_DATA__;
  }
  return null;
};

// Функция для загрузки скриптов Bitrix, необходимых для работы с сессиями
export const loadBitrixCore = async () => {
  if (typeof window !== 'undefined' && !window.BX) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/bitrix/js/main/core/core.js';
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  return Promise.resolve();
};

export default {
  hasBitrixSession,
  getBitrixSessionId,
  isUserAuthenticated,
  getCurrentUserId,
  injectSessionData,
  getSessionData,
  loadBitrixCore,
}; 