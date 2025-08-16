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
  const [isMobileWebkit, setIsMobileWebkit] = useState(false);
  const router = useRouter();

  // Подключаем инструменты для работы с моками в режиме разработки
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && USE_MOCKS) {
      import('../lib/mocks/mocks').then((module) => {
        console.log('[App] Моковый слой инициализирован');
      });
    }
  }, []);

  // Detect mobile WebKit browsers (iOS Safari, Android WebKit, etc)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = navigator.userAgent;
      // iOS Safari or Android WebKit-based browsers
      const isWebkit = /AppleWebKit/.test(ua) && !/Chrome/.test(ua);
      const isMobile = /Mobile|iPhone|iPad|iPod|Android/i.test(ua);
      setIsMobileWebkit(isWebkit && isMobile);
    }
  }, []);

  // Enhanced overlay transition animation
  useEffect(() => {
    const handleStart = () => {
      setIsTransitioning(true);
    };

    const handleEnd = () => {
      // Для WebKit на мобильных — чуть дольше задержка и плавнее
      setTimeout(() => {
        setIsTransitioning(false);
      }, isMobileWebkit ? 120 : 30);
    };

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleEnd);
    router.events.on('routeChangeError', handleEnd);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleEnd);
      router.events.off('routeChangeError', handleEnd);
    };
  }, [router.events, isMobileWebkit]);

  // Стили для overlay с учетом WebKit/mobile и большей прозрачности
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: isMobileWebkit
      ? 'rgba(255,255,255,0.32)'
      : 'rgba(255,255,255,0.22)',
    // Для WebKit используем blur(2.5px) и -webkit-backdrop-filter
    backdropFilter: isMobileWebkit ? 'blur(2.5px)' : 'blur(1px)',
    WebkitBackdropFilter: isMobileWebkit ? 'blur(2.5px)' : 'blur(1px)',
    zIndex: 9999,
    pointerEvents: isTransitioning ? 'auto' : 'none',
    opacity: isTransitioning ? 1 : 0,
    transition: isTransitioning
      ? isMobileWebkit
        ? 'opacity 220ms cubic-bezier(0.4,0,0.2,1)'
        : 'opacity 150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      : isMobileWebkit
        ? 'opacity 350ms cubic-bezier(0.4,0,0.2,1)'
        : 'opacity 250ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Для WebKit: убираем лишние артефакты
    willChange: isMobileWebkit ? 'opacity, backdrop-filter' : 'opacity',
    touchAction: isMobileWebkit ? 'none' : undefined,
    overscrollBehavior: isMobileWebkit ? 'none' : undefined,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <ThemeProvider theme={theme}>
          <Head>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>Shop4Shoot</title>
          </Head>
          <GlobalStyles />

          {/* Subtle overlay transition element, optimized for WebKit/mobile, more transparent, no spinner */}
          <div style={overlayStyle}></div>

          <Component {...pageProps} />
          {process.env.NODE_ENV !== 'production' && <ReactQueryDevtools initialIsOpen={false} />}
          {process.env.NODE_ENV !== 'production' && <Logger />}
        </ThemeProvider>
      </Hydrate>
    </QueryClientProvider>
  );
}

export default MyApp;