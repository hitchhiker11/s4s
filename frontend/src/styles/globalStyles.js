import { createGlobalStyle } from 'styled-components';
import { COLORS, TYPOGRAPHY } from './tokens';

const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: ${TYPOGRAPHY.fontFamily};
    font-size: ${TYPOGRAPHY.size.md};
    line-height: 1.5;
    color: ${COLORS.black};
    background-color: ${COLORS.white};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
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
`;

export default GlobalStyles; 