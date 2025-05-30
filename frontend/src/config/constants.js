/**
 * Глобальные константы приложения
 */

// Контактная информация для сайта
export const CONTACT_INFO = {
  phone: {
    display: "+7 (495) 123-45-67",
    link: "+74951234567"
  },
  email: {
    display: "info@shop4shoot.ru",
    link: "info@shop4shoot.ru"
  },
  address: "г. Москва, ул. Примерная, д. 123",
  workingHours: "Пн-Пт: 9:00-18:00, Сб: 10:00-15:00"
};

// Социальные сети
export const SOCIAL_MEDIA = {
  vk: "https://vk.com/shop4shoot",
  telegram: "https://t.me/shop4shoot",
  whatsapp: "https://wa.me/74951234567",
  instagram: "https://instagram.com/shop4shoot"
};

// Настройки API
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_BITRIX_URL || 'https://shop4shoot.com/api',
  timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10),
  useMocks: process.env.NEXT_PUBLIC_USE_MOCKS === 'true'
};

// Другие глобальные константы, которые могут понадобиться приложению
export const APP_CONFIG = {
  siteTitle: "Shop4Shoot - Магазин товаров для спортивной стрельбы",
  defaultLanguage: "ru",
  defaultCurrency: "RUB"
}; 