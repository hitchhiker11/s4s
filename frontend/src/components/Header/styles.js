import styled, { css, keyframes } from 'styled-components';
import { SHADOWS as TokenShadows, COLORS, SPACING as TOKENS_SPACING, TYPOGRAPHY, SIZES as TOKENS_SIZES, ANIMATION as TOKENS_ANIMATION } from '../../styles/tokens';

// ==========================================================================
// Theme Configuration (Colors, Sizes, Spacing, Typography, Animation)
// ==========================================================================

// Цвета (значения должны соответствовать Figma)
export const HEADER_COLORS = {
  // Primary & Accent
  primary: COLORS.primary, // Основной акцентный цвет (кнопки, активные ссылки, бейдж)
  primaryHover: '#C8103A', // Наведение на primary
  accent: '#...', // Дополнительный акцентный цвет, если есть

  // Neutrals
  dark: COLORS.black,      // Основной темный текст
  textSecondary: COLORS.gray500, // Второстепенный текст (TopBar)
  light: COLORS.white,     // Основной светлый фон (шапка)
  background: '#F9F9F9', // Фон страницы (для согласованности)
  gray: COLORS.gray100,      // Фон TopBar, фон ховера в моб. меню
  lightGray: COLORS.gray200, // Разделители, границы
  disabled: '#BDBDBD',   // Неактивные элементы

  // Functional
  error: '#D32F2F',
  warning: '#FFA000',
  success: '#388E3C',
  info: COLORS.info,

  // Specific Components
  overlay: 'rgba(0, 0, 0, 0.6)', // Оверлей моб. меню
  shadow: 'rgba(0, 0, 0, 0.1)', // Тень шапки
  badgeBackground: 'var(--header-color-primary, #E7194A)', // Используем CSS переменную для гибкости
  badgeText: 'var(--header-color-light, #FFFFFF)',
};

// Shadows
export const SHADOWS = {
  sm: TokenShadows.sm, // "0 2px 5px rgba(0, 0, 0, 0.1)"
  md: TokenShadows.md, // "4px 4px 0px rgba(182, 182, 182, 1)"
  lg: TokenShadows.lg  // "0px 0px 30px rgba(129, 129, 129, 0.3)"
};

// Размеры (значения должны соответствовать Figma)
export const HEADER_SIZES = {
  // Header
  headerHeight: '84px',
  headerHeightScrolled: '64px',
  topBarHeight: '40px',

  // Logo
  logoHeight: '44px',
  logoHeightScrolled: '32px',

  // Icons
  iconSize: '24px',
  iconSizeSmall: '20px', // Для TopBar и др. мелких иконок
  topBarIconSize: '16px', // Явно для TopBar

  // Other
  mobileMenuWidth: '320px',
  containerMaxWidth: TOKENS_SIZES.containerMaxWidth,
  borderRadius: {
    sm: '4px',
    md: '8px',
    full: '50%',
  },
};

// Отступы (значения должны соответствовать Figma)
export const HEADER_SPACING = {
  none: '0px',
  tiny: '4px',    // 2xs
  small: '8px',   // xs
  medium: '12px', // s (уменьшил для большей гранулярности)
  regular: '16px',// m (бывший medium)
  large: '24px',  // l (бывший large)
  xl: '32px',     // xl
  xxl: '40px',    // 2xl
};

// Типографика и анимации импортированы из tokens.js

// Экспортируем ANIMATION из tokens с дополнительными свойствами
export const ANIMATION = {
  ...TOKENS_ANIMATION,
  transitionAll: TOKENS_ANIMATION.transitionBase // Алиас для совместимости
};

// ==========================================================================
// Breakpoints and Media Queries
// ==========================================================================

export const breakpoints = {
  xs: '375px',  // Small mobile
  sm: '576px',  // Mobile landscape / large mobile
  md: '768px',  // Tablet portrait
  lg: '992px',  // Tablet landscape / Small desktop (точка переключения на моб. меню)
  xl: '1200px', // Desktop
  xxl: '1400px' // Large Desktop
};

// Helper for creating min-width media queries
const minWidth = (bp) => `@media (min-width: ${breakpoints[bp]})`;
// Helper for creating max-width media queries
const maxWidth = (bp) => `@media (max-width: ${breakpoints[bp]})`;

export const mediaQuery = {
  // Min-width based queries (mobile-first approach)
  min: {
    xs: minWidth('xs'),
    sm: minWidth('sm'),
    md: minWidth('md'),
    lg: minWidth('lg'),
    xl: minWidth('xl'),
    xxl: minWidth('xxl'),
  },
  // Max-width based queries (desktop-first fallback, use sparingly)
  max: {
    xs: maxWidth('xs'),
    sm: maxWidth('sm'),
    md: maxWidth('md'),
    lg: maxWidth('lg'), // Use this for hiding desktop nav etc.
    xl: maxWidth('xl'),
    xxl: maxWidth('xxl'),
  },
  // Specific device capabilities
  hover: '@media (hover: hover) and (pointer: fine)', // Hover effects only for mouse users
  touch: '@media (hover: none) and (pointer: coarse)', // Styles specific to touch devices
};

// Алиас для совместимости с Header.js
export const mediaQueries = mediaQuery;

// ==========================================================================
// Common Styled Components & CSS Utilities
// ==========================================================================

/**
 * Main content container with max-width and centered alignment.
 */
export const Container = styled.div`
  width: 100%;
  max-width: ${HEADER_SIZES.containerMaxWidth};
  margin-left: auto;
  margin-right: auto;
  padding-left: ${HEADER_SPACING.large}; // Используем большие отступы для контейнера
  padding-right: ${HEADER_SPACING.large};

  ${mediaQuery.max.sm} { // Меньше отступы на мобильных
    padding-left: ${HEADER_SPACING.regular};
    padding-right: ${HEADER_SPACING.regular};
  }
`;

/**
 * Base styles for button elements (reset + base interactions).
 * Includes focus-visible handling for better accessibility.
 */
export const ButtonStyles = css`
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  text-decoration: none;
  font-family: inherit;
  color: inherit; // Наследуем цвет текста по умолчанию
  transition: ${ANIMATION.transitionAll};
  -webkit-tap-highlight-color: transparent; // Убираем подсветку на мобильных

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Improved focus handling */
  &:focus {
     outline: none; // Убираем стандартный аутлайн
  }
  &:focus-visible { // Показываем кастомный аутлайн только при фокусе с клавиатуры
    outline: 2px solid ${HEADER_COLORS.primary};
    outline-offset: 2px;
    border-radius: ${HEADER_SIZES.borderRadius.sm}; // Добавляем скругление к фокусу
  }

  /* Default hover styles - apply specific hover in components */
  ${mediaQuery.hover} {
    &:hover:not(:disabled) {
       /* Add subtle background or color change */
       /* Example: background-color: rgba(0, 0, 0, 0.05); */
    }
  }
`;

/**
 * Wrapper for icons to ensure consistent sizing and alignment.
 */
export const HeaderIconStyles = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.$size || HEADER_SIZES.iconSize};
  height: ${props => props.$size || HEADER_SIZES.iconSize};
  flex-shrink: 0; // Иконки не должны сжиматься

  svg {
    display: block; // Предотвращает лишние отступы под svg
    width: 100%;
    height: 100%;
    fill: none; // Убрать заливку для соответствия Figma
    stroke: currentColor; // Позволяет управлять цветом через 'color' родителя
    stroke-width: 1.5; // Ширина линии соответствует Figma
    transition: all ${ANIMATION.duration} ${ANIMATION.timing};
  }
`;

/**
 * Base styles for the Logo link and image.
 */
export const LogoStyles = styled.div`
  display: flex; // Используем flex для выравнивания, если внутри будет что-то еще
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  a, // Стили для ссылки
  button // Если логотип - кнопка (редко)
  {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 0; // Убирает отступы под img
    color: inherit; // Для сброса цвета ссылки
    text-decoration: none;
    ${ButtonStyles} // Применяем базовые стили кнопки для сброса и фокуса

    &:focus-visible { // Кастомный фокус для лого
       outline: 2px solid ${HEADER_COLORS.primary};
       outline-offset: 3px; // Немного дальше от лого
       border-radius: ${HEADER_SIZES.borderRadius.sm};
    }
  }

  img {
    display: block;
    width: auto;
    height: auto;
    max-width: 44px;
    max-height: 44px;
    transition: all ${ANIMATION.duration} ${ANIMATION.timing};
  }
`;

/**
 * Styles applied to the header container when the page is scrolled.
 */
export const scrolledStyles = css`
  height: ${HEADER_SIZES.headerHeightScrolled};
  box-shadow: 0 2px 10px ${HEADER_COLORS.shadow}; // Тень может быть другой при скролле
  background-color: ${HEADER_COLORS.light}; // Фон может меняться

  ${LogoStyles} img { // Уменьшаем логотип при скролле
    height: ${HEADER_SIZES.logoHeightScrolled};
  }

  /* Добавьте сюда другие стили, меняющиеся при скролле, если необходимо */
  /* Например, изменение padding, цвета текста и т.д. */
`;

/**
 * Styles for the cart counter badge.
 */
export const badgeStyles = css`
  position: absolute;
  top: -6px;             // Точное позиционирование подбирается по макету
  right: -6px;            // Точное позиционирование подбирается по макету
  min-width: 20px;        // Минимальная ширина, чтобы влезал 0
  height: 20px;
  padding: 0 6px;         // Отступы для цифр > 9
  background-color: ${HEADER_COLORS.primary};
  color: white;
  border-radius: 10px;     // Делаем круглым или овальным в зависимости от контента
  font-size: 12px;        // Маленький шрифт для счетчика
  font-weight: 600;
  line-height: 20px;      // Центрируем текст вертикально
  text-align: center;
  white-space: nowrap;    // Предотвращаем перенос текста
  pointer-events: none;   // Бейдж не должен мешать клику на иконку
  box-shadow: 0 1px 3px rgba(0,0,0,0.2); // Небольшая тень
`;

/**
 * Base styles for navigation links (used in Desktop and potentially TopBar).
 * Includes active state indication and hover effects.
 */
export const NavLinkBaseStyles = css`
  ${ButtonStyles} // Наследуем базовые стили кнопки (сброс, фокус)
  padding: ${HEADER_SPACING.small} ${HEADER_SPACING.medium};
  margin: 0; // Убираем отрицательные отступы, лучше управлять через gap родителя
  font-family: ${TYPOGRAPHY.fontFamily};
  font-size: ${TYPOGRAPHY.size.md};
  font-weight: ${TYPOGRAPHY.weight.medium};
  color: ${HEADER_COLORS.dark};
  text-decoration: none;
  border-radius: ${HEADER_SIZES.borderRadius.sm};
  position: relative; // Для псевдоэлемента подчеркивания

  // Убираем иконки, если они случайно попадут сюда (ссылки только текстовые)
  svg { display: none; }

  // Подчеркивание снизу
  &::after {
    content: '';
    position: absolute;
    left: ${HEADER_SPACING.medium};
    right: ${HEADER_SPACING.medium};
    bottom: 4px; // Немного поднимем линию
    height: 2px;
    background-color: currentColor; // Используем текущий цвет текста (изменится при hover/active)
    transform: scaleX(0);
    transform-origin: center;
    transition: transform ${ANIMATION.duration} ${ANIMATION.timing};
  }

  ${mediaQuery.hover} {
    &:hover:not(.active):not(:disabled) { // Не применяем hover к активной ссылке
      color: ${HEADER_COLORS.primary};
      background-color: transparent; // Убираем фон, если он был в ButtonStyles
      &::after {
         transform: scaleX(1);
      }
    }
  }

  // Стили для активной ссылки
  &.active {
    color: ${HEADER_COLORS.primary};
    font-weight: ${TYPOGRAPHY.weight.bold}; // Можно сделать жирнее
    cursor: default; // Не кликабельна, т.к. уже на этой странице
    &::after {
       transform: scaleX(1); // Показываем подчеркивание для активной ссылки
    }
  }

  &:focus-visible { // Стили фокуса для ссылок
     color: ${HEADER_COLORS.primary};
     outline-color: ${HEADER_COLORS.primary}; // Цвет стандартного аутлайна
  }
`;

// Стили для текстовых ссылок (телефон, email и т.д.)
export const TextLinkStyles = css`
  color: inherit;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

// Стили для ссылок в соц. сетях
export const SocialIconStyles = css`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${HEADER_COLORS.dark};
  transition: color ${ANIMATION.duration} ${ANIMATION.timing};
  
  &:hover {
    color: ${HEADER_COLORS.primary};
  }
`;

// Общие стили для ссылок
export const LinkStyles = css`
  text-decoration: none;
  color: ${HEADER_COLORS.dark};
  transition: color ${ANIMATION.duration} ${ANIMATION.timing};
  
  &:hover {
    color: ${HEADER_COLORS.primary};
  }
`;

// Стили для элемента навигации (решение проблемы с undefined)
export const NavItemStyles = styled.li`
  list-style: none;
  margin: 0;
  padding: 0;
  
  a {
    ${NavLinkBaseStyles}
    display: block;
  }
`;

// ==========================================================================
// Animation Keyframes
// ==========================================================================

export const overlayFadeIn = keyframes`
  from { opacity: 0; visibility: hidden; }
  to { opacity: 1; visibility: visible; }
`;

export const overlayFadeOut = keyframes`
  from { opacity: 1; visibility: visible; }
  to { opacity: 0; visibility: hidden; }
`;

export const slideInRight = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const slideOutRight = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;


// ==========================================================================
// Flexbox Utilities (Optional, can be useful)
// ==========================================================================

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flexColumn = css`
  display: flex;
  flex-direction: column;
`;