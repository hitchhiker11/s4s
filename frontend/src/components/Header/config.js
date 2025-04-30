/**
 * Конфигурация для компонента Header
 * Здесь хранятся все конфигурационные данные, которые могут меняться
 */

import PropTypes from 'prop-types';
import {
  PhoneIcon,
  EmailIcon,
  // Import social icons directly
  VkIcon,
  TelegramIcon,
  InstagramIcon,
  // UserIcon, // Если нужна иконка для ЛК
  // TODO: Импортировать реальные иконки соцсетей
  // VkIcon,
  // TelegramIcon,
  // WhatsAppIcon,
  // YoutubeIcon,
} from './icons';

// ==========================================================================
// Contact Information
// ==========================================================================

export const CONTACT_INFO = {
  phone: {
    id: 'phone',
    display: '+7 (495) 123-45-67',
    link: '+74951234567', // Для href="tel:"
    ariaLabel: 'Позвонить по номеру +7 (495) 123-45-67',
    icon: PhoneIcon, // Компонент иконки
    itemprop: 'telephone', // Для микроразметки Schema.org
  },
  email: {
    id: 'email',
    display: 'info@shop4shoot.com',
    link: 'info@shop4shoot.com', // Для href="mailto:"
    ariaLabel: 'Написать на почту info@shop4shoot.com',
    icon: EmailIcon,
    itemprop: 'email',
  },
  // Можно добавить адрес, часы работы и т.д.
  // address: {
  //   id: 'address',
  //   display: 'г. Москва, ул. Примерная, д. 1',
  //   ariaLabel: 'Наш адрес',
  //   icon: LocationIcon, // Пример
  //   itemprop: 'address',
  // },
};

// ==========================================================================
// Social Media Links
// ==========================================================================

export const SOCIAL_LINKS = [
  {
    id: 'vk', // This matches the key in SOCIAL_ICONS
    name: 'VK',
    url: 'https://vk.com/your_group', // ЗАМЕНИТЬ НА РЕАЛЬНУЮ ССЫЛКУ
    ariaLabel: 'Перейти в нашу группу ВКонтакте',
    title: 'ВКонтакте', // title для всплывающей подсказки
  },
  {
    id: 'telegram', // Changed from 'tg' to match the key in SOCIAL_ICONS
    name: 'Telegram',
    url: 'https://t.me/your_channel', // ЗАМЕНИТЬ НА РЕАЛЬНУЮ ССЫЛКУ
    ariaLabel: 'Перейти в наш Telegram канал',
    title: 'Telegram',
  },
  {
    id: 'instagram', // Added Instagram which is defined in SOCIAL_ICONS
    name: 'Instagram',
    url: 'https://instagram.com/your_account', // ЗАМЕНИТЬ НА РЕАЛЬНУЮ ССЫЛКУ
    ariaLabel: 'Перейти в наш Instagram',
    title: 'Instagram',
  },
  // {
  //   id: 'whatsapp',
  //   name: 'WhatsApp',
  //   url: 'https://wa.me/79991234567', // ЗАМЕНИТЬ НА РЕАЛЬНЫЙ НОМЕР
  //   ariaLabel: 'Написать нам в WhatsApp',
  //   title: 'WhatsApp',
  // },
  // {
  //   id: 'youtube',
  //   name: 'YouTube',
  //   url: 'https://youtube.com/your_channel', // ЗАМЕНИТЬ НА РЕАЛЬНУЮ ССЫЛКУ
  //   ariaLabel: 'Перейти на наш YouTube канал',
  //   title: 'YouTube',
  // },
  // Добавьте другие соцсети по аналогии
];

// PropTypes для объекта социальной ссылки (для использования в компонентах)
export const SocialLinkPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  title: PropTypes.string,
});

// ==========================================================================
// Navigation Links
// ==========================================================================

// Общие ссылки, используемые в нескольких местах
const COMMON_LINKS = {
  catalog: { id: 'catalog', name: 'Каталог', path: '/catalog' },
  brands: { id: 'brands', name: 'Бренды', path: '/brands' },
  delivery: { id: 'delivery', name: 'О нас', path: '/about' },
  contacts: { id: 'contacts', name: 'Контакты', path: '/contacts' },
  about: { id: 'about', name: 'О компании', path: '/about' },
  shops: { id: 'shops', name: 'Магазины', path: '/shops' },
  buyers: { id: 'buyers', name: 'Покупателям', path: '/buyers' },
  promotions: { id: 'promotions', name: 'Акции', path: '/promotions' },
};

// Основные ссылки навигации (для десктопа - MainHeader)
// Порядок и состав согласно Figma
export const NAV_LINKS_DESKTOP = [
  COMMON_LINKS.catalog,
  COMMON_LINKS.brands,
  COMMON_LINKS.delivery,
  COMMON_LINKS.contacts,
  // Добавьте или измените ссылки согласно макету десктопного хедера
];

// Ссылки для мобильного меню (MobileMenu)
// Могут включать больше ссылок или иметь другой порядок
export const NAV_LINKS_MOBILE = [
  COMMON_LINKS.catalog,
  COMMON_LINKS.brands,
  COMMON_LINKS.delivery,
  COMMON_LINKS.contacts,
  COMMON_LINKS.about, // Например, 'О компании' может быть только в моб. меню
  COMMON_LINKS.shops,
  COMMON_LINKS.promotions,
  // ... другие ссылки
];

// Ссылки для верхней панели (TopBar)
export const NAV_LINKS_TOP_BAR = [
  COMMON_LINKS.shops,
  COMMON_LINKS.buyers,
  COMMON_LINKS.promotions,
  // Возможно, ссылка 'О компании' или другие
  // COMMON_LINKS.about,
];

// PropTypes для объекта навигационной ссылки
export const NavLinkPropTypes = PropTypes.shape({
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  // Можно добавить другие поля, например, для выпадающих меню
  // subLinks: PropTypes.arrayOf(NavLinkPropTypes),
});

// ==========================================================================
// Authentication Paths & Texts
// ==========================================================================

export const AUTH_PATHS = {
  login: '/login',       // Страница входа
  register: '/register', // Страница регистрации
  profile: '/profile',   // Страница личного кабинета
  logout: '/logout',     // URL для выхода (может быть API endpoint)
};

export const AUTH_TEXTS = {
  loginRegister: 'Вход / Регистрация',
  profile: 'Личный кабинет',
  logout: 'Выйти',
}; 