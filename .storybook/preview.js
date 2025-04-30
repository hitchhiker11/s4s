import { ThemeProvider } from 'styled-components';
import { COLORS, TYPOGRAPHY, SPACING, SIZES, ANIMATION, mediaQueries } from '../frontend/src/styles/tokens';
import { HEADER_COLORS, HEADER_SIZES, HEADER_SPACING, SHADOWS, mediaQuery, ANIMATION as HEADER_ANIMATION } from '../frontend/src/components/Header/styles';

// Create a combined theme object to be used within stories
const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  sizes: SIZES,
  animation: ANIMATION,
  mediaQueries,
  header: {
    colors: HEADER_COLORS,
    sizes: HEADER_SIZES,
    spacing: HEADER_SPACING,
    animation: HEADER_ANIMATION,
    shadows: SHADOWS,
  },
  mediaQuery,
};

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'light',
          value: '#FFFFFF',
        },
        {
          name: 'gray',
          value: '#F4F4F4',
        },
        {
          name: 'dark',
          value: '#333333',
        },
      ],
    },
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '360px',
            height: '640px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '800px',
          },
        },
        wideDesktop: {
          name: 'Wide Desktop',
          styles: {
            width: '1440px',
            height: '900px',
          },
        },
      },
    },
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <ThemeProvider theme={theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;