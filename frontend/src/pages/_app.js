import React, { useState, useEffect } from 'react';
import { QueryClientProvider, Hydrate } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ThemeProvider } from 'styled-components';
import Head from 'next/head';
import { useRouter } from 'next/router';
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  // Подключаем инструменты для работы с моками в режиме разработки
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && USE_MOCKS) {
      import('../lib/mocks/mocks').then((module) => {
        // console.log('[App] Моковый слой инициализирован');
      });
    }
  }, []);

  // Enhanced overlay transition animation
  useEffect(() => {
    const handleStart = () => {
      setIsTransitioning(true);
    };
    
    const handleEnd = () => {
      // Небольшая задержка для плавного завершения анимации
      setTimeout(() => {
        setIsTransitioning(false);
      }, 30);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleEnd);
    router.events.on('routeChangeError', handleEnd);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleEnd);
      router.events.off('routeChangeError', handleEnd);
    };
  }, [router.events]);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider theme={theme}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Shop4Shoot</title>
          </Head>
          <GlobalStyles />
          
          {/* Subtle overlay transition element */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.4)',
              backdropFilter: 'blur(1px)',
              zIndex: 9999,
              pointerEvents: isTransitioning ? 'auto' : 'none',
              opacity: isTransitioning ? 1 : 0,
              transition: isTransitioning 
                ? 'opacity 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                : 'opacity 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Very subtle loading indicator */}
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                borderTop: '1px solid rgba(0, 0, 0, 0.15)',
                borderRadius: '50%',
                animation: isTransitioning ? 'spin 1.2s linear infinite' : 'none',
                opacity: isTransitioning ? 0.7 : 0,
                transform: `scale(${isTransitioning ? 1 : 0.9})`,
                transition: 'opacity 100ms ease, transform 100ms ease'
              }}
            />
          </div>
          
          {/* Add keyframes for spinner */}
          <style jsx global>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
          
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