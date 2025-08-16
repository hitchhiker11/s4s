/**
 * Модуль для работы с авторизацией в Bitrix
 */

/**
 * Загружает скрипты Bitrix, необходимые для работы с авторизацией
 */
export const loadBitrixCore = async () => {
  // В реальном приложении здесь был бы код для загрузки скриптов Bitrix
  // console.log('Loading Bitrix core...');
  return new Promise(resolve => setTimeout(resolve, 500));
};

/**
 * Проверяет, авторизован ли пользователь
 */
export const isUserAuthenticated = async () => {
  // В режиме разработки всегда возвращаем false для удобства тестирования
  // console.log('Checking if user is authenticated...');
  return false;
};

/**
 * Получает ID текущего пользователя
 */
export const getCurrentUserId = async () => {
  // В реальном приложении здесь был бы запрос к Bitrix
  // console.log('Getting current user ID...');
  return null;
};

/**
 * Получает информацию о текущем пользователе
 */
export const getUserInfo = async (userId) => {
  // В реальном приложении здесь был бы запрос к Bitrix
  // console.log('Getting user info for ID:', userId);
  return null;
};

// Выполнение выхода пользователя
export const logout = async () => {
  try {
    // В режиме разработки просто симулируем успешный выход
    if (process.env.NODE_ENV === 'development') {
      return true;
    }

    // В продакшене делаем запрос к Bitrix API
    await new Promise((resolve, reject) => {
      if (!window.BX || !window.BX.ajax) {
        return reject(new Error('BX.ajax не доступен'));
      }

      window.BX.ajax.runAction('shop4shoot:custom.api.user.logout', {
        data: {},
      }).then(
        (response) => resolve(response.data),
        (error) => reject(error)
      );
    });

    // Перезагружаем страницу, чтобы сбросить куки и состояние авторизации
    window.location.reload();
    return true;
  } catch (error) {
    // console.warn('Ошибка при выходе пользователя:', error);
    return false;
  }
}; 