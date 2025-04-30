// Цвета
export const COLORS = {
  // Основные
  primary: "#E7194A",
  primaryHover: "#C8103A",
  black: "#1C1C1C",
  white: "#FCFCFC",
  
  // Нейтральные
  gray100: "#F8F8F8",
  gray200: "#EAEAEA",
  gray300: "#DDDDDD",
  gray400: "#B6B6B6",
  gray500: "#6B6B6B",
  
  // Функциональные
  error: "#D32F2F",
  success: "#388E3C",
  warning: "#FFA000",
  info: "#1976D2",
  
  // Градиенты
  fireGradient: "linear-gradient(135deg, #E7194A 0%, #FFAA00 100%)"
};

// Типографика
export const TYPOGRAPHY = {
  fontFamily: "'Rubik', -apple-system, BlinkMacSystemFont, sans-serif",
  additionalFonts: {
    montserrat: "'Montserrat', sans-serif",
    arimo: "'Arimo', sans-serif"
  },
  
  // Веса шрифтов
  weight: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
    black: 900
  },
  
  // Размеры шрифтов
  size: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "20px",
    xl: "24px",
    "2xl": "30px",
    "3xl": "35px",
    "4xl": "40px",
    "5xl": "54px",
    "6xl": "107px"
  }
};

// Отступы
export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
  "3xl": "40px",
  "4xl": "60px"
};

// Размеры
export const SIZES = {
  headerHeight: "84px",
  headerHeightScrolled: "64px",
  containerMaxWidth: "1493px",
  
  // Иконки
  iconSize: "24px",
  iconSizeSmall: "20px",
  
  // Логотип
  logoHeight: "44px",
  logoHeightScrolled: "32px",
  
  // Радиусы
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "16px",
    round: "50%"
  }
};

// Анимации
export const ANIMATION = {
  duration: "0.25s",
  timing: "ease-in-out",
  transitionBase: "all 0.25s ease-in-out"
};

// Тени
export const SHADOWS = {
  sm: "0 2px 5px rgba(0, 0, 0, 0.1)",
  md: "4px 4px 0px rgba(182, 182, 182, 1)",
  lg: "0px 0px 30px rgba(129, 129, 129, 0.3)"
};

// Брейкпойнты
export const BREAKPOINTS = {
  xs: "375px",
  sm: "576px",
  md: "768px",
  lg: "992px",
  xl: "1200px",
  xxl: "1400px"
};

// Медиа-запросы
export const mediaQueries = {
  xs: `@media (min-width: ${BREAKPOINTS.xs})`,
  sm: `@media (min-width: ${BREAKPOINTS.sm})`,
  md: `@media (min-width: ${BREAKPOINTS.md})`,
  lg: `@media (min-width: ${BREAKPOINTS.lg})`,
  xl: `@media (min-width: ${BREAKPOINTS.xl})`,
  xxl: `@media (min-width: ${BREAKPOINTS.xxl})`,
  hover: `@media (hover: hover)`
}; 