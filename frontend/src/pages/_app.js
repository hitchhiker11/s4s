import React, { useState, useEffect } from 'react';
import { QueryClientProvider, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from 'styled-components';
import Head from 'next/head';
import Header from '../components/Header/index';
import { COLORS, TYPOGRAPHY, SHADOWS } from '../styles/tokens';
import GlobalStyles from '../styles/globalStyles';
import { createQueryClient } from '../lib/react-query-client';
import Logger from '../components/debug/Logger';
import '../components/AboutSlider/slider.css'; // Импортируем стили слайдера глобально
import '../styles/safari-swiper-fixes.css'; // Импортируем исправления для Safari WebKit
import { USE_MOCKS } from '../lib/api/bitrix';

// Определяем тему для ThemeProvider
const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  shadows: SHADOWS,
};

/**
 * Основной компонент приложения Next.js
 */
function MyApp({ Component, pageProps }) {
  // Создаем QueryClient на стороне клиента
  const [queryClient] = useState(() => createQueryClient());

  // Подключаем инструменты для работы с моками в режиме разработки
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && USE_MOCKS) {
      import('../lib/mocks/mocks').then((module) => {
        console.log('[App] Моковый слой инициализирован');
      });
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider theme={theme}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Shop4Shoot</title>
          </Head>
          <GlobalStyles />
          {/* <Header useMocks={true} mockBasketCount={5} /> */}
          <Component {...pageProps} />
          {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
          {process.env.NODE_ENV !== 'production' && <Logger />}
        </ThemeProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp; 