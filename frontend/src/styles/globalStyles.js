import { createGlobalStyle } from 'styled-components';
import { COLORS, TYPOGRAPHY, SIZES, mediaQueries } from './tokens';

const GlobalStyles = createGlobalStyle`
  :root {
    --container-width: ${SIZES.containerMaxWidth};
    --header-height: ${SIZES.headerHeight};
    
    /* Типографические переменные для использования в CSS */
    --font-family-base: ${TYPOGRAPHY.fontFamily};
    --font-family-heading: ${TYPOGRAPHY.additionalFonts.montserrat};
    
    /* Адаптивные отступы */
    --page-padding: 16px;
    
    ${mediaQueries.md} {
      --page-padding: 24px;
    }
    
    ${mediaQueries.lg} {
      --page-padding: 32px;
    }
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: var(--font-family-base);
    font-size: ${TYPOGRAPHY.size.md};
    line-height: 1.5;
    color: ${COLORS.black};
    background-color: ${COLORS.white};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    width: 100%;
  }

  /* Настройка основных заголовков */
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-family-heading);
    margin-top: 0;
    font-weight: ${TYPOGRAPHY.weight.bold};
    line-height: 1.2;
  }

  /* Адаптивная типографика */
  h1 { font-size: clamp(32px, 7vw, ${TYPOGRAPHY.size['6xl']}); }
  h2 { font-size: clamp(28px, 5vw, ${TYPOGRAPHY.size['3xl']}); }
  h3 { font-size: clamp(24px, 4vw, ${TYPOGRAPHY.size['2xl']}); }
  h4 { font-size: clamp(20px, 3vw, ${TYPOGRAPHY.size.xl}); }
  h5 { font-size: clamp(18px, 2.5vw, ${TYPOGRAPHY.size.lg}); }
  h6 { font-size: clamp(16px, 2vw, ${TYPOGRAPHY.size.md}); }

  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      text-decoration: none;
    }
  }

  button {
    font-family: inherit;
    background: none;
    border: none;
    cursor: pointer;
  }

  ul, ol {
    list-style: none;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }

  /* Доступность - outline для клавиатурной навигации */
  :focus-visible {
    outline: 2px solid ${COLORS.primary};
    outline-offset: 2px;
  }

  /* Контейнер по умолчанию */
  .container {
    width: 100%;
    max-width: var(--container-width);
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--page-padding);
    padding-right: var(--page-padding);
  }
`;

export default GlobalStyles; 