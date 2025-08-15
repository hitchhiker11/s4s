import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

import MainHeader from './MainHeader';
import MobileMenu from './MobileMenu';
import ContactsModal from '../modals/ContactsModal';
import { loadBitrixCore, isUserAuthenticated, getCurrentUserId, getUserInfo } from '../../lib/auth';
import { ANIMATION, HEADER_SIZES } from './styles';
import { useBasketCount } from '../../hooks/useBasket';

// Контейнер заголовка
const HeaderContainer = styled.header`
  position: ${props => (props.$fixedVisible && props.$hidden === false ? 'fixed' : 'sticky')};
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--header-bg-color, white);
  transition: transform ${props => props.$hidden ? '220ms' : '220ms'} ease, background-color ${ANIMATION.duration} ${ANIMATION.timing};
  will-change: transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: ${props => (props.$hidden ? 'translateY(-100%)' : 'translateY(0)')};
`;

const HeaderSpacer = styled.div`
  width: 100%;
  height: ${props => (props.$height ? `${props.$height}px` : '0')};
`;

/**
 * Главный компонент заголовка, объединяющий все части
 * @param {Object} props - Props компонента
 * @param {boolean} [props.useMocks=false] - Использовать ли мок-данные вместо реальных API
 * @param {number} [props.mockBasketCount=5] - Количество товаров в корзине для мок-режима
 */
const Header = ({ useMocks = false, mockBasketCount = 5 }) => {
  // Состояния компонента
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  // Default state: header shown at top as sticky (not fixed), no overlay
  const [isHidden, setIsHidden] = useState(false);
  // Больше не переключаемся в fixed, оставляем единый sticky-контейнер
  const [isFixedVisible, setIsFixedVisible] = useState(false);
  const lastScrollYRef = useRef(0);
  const deltaAccumulatorRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const headerRef = useRef(null);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  // Получаем количество товаров в корзине через кастомный хук
  const { 
    count: basketCount = 0, 
    isLoading: isBasketLoading, 
    error: basketError,
    isInitialized: isFuserIdInitialized
  } = useBasketCount({
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 2, // 2 minutes
    autoInitialize: true
  });

  // Use mockBasketCount if we're in mock mode, otherwise use real basket count
  // Show 0 if fuser_id is not yet initialized to avoid flickering
  const displayBasketCount = useMocks 
    ? mockBasketCount 
    : (isFuserIdInitialized ? basketCount : 0);

  // Обработчик скролла для изменения внешнего вида хедера
  useEffect(() => {
    // Hide header only after scrolling at least the header height from the top
    let threshold = 12;
    let ticking = false;

    const updateOnScroll = () => {
      const currentY = window.scrollY || 0;
      const lastY = lastScrollYRef.current || 0;
      const deltaY = currentY - lastY;
      const now = Date.now();
      const dt = Math.max(1, now - lastTimeRef.current);
      const velocity = deltaY / dt; // px per ms

      setIsScrolled(currentY > 50);

      // Update threshold dynamically to be at least header height near the top
      const headerHeight = headerRef.current ? headerRef.current.offsetHeight || 0 : HEADER_SIZES.headerHeight;
      const numericHeaderHeight = typeof headerHeight === 'number' ? headerHeight : parseInt(headerHeight) || 0;
      const isNearTop = lastY <= numericHeaderHeight;
      threshold = isNearTop ? Math.max(12, numericHeaderHeight) : 12;

      if (currentY <= 0) {
        setIsHidden(false);
        setIsFixedVisible(false);
        deltaAccumulatorRef.current = 0;
      } else {
        // Instant reaction on fast gestures
        if (velocity > 0.35) {
          setIsHidden(true);
          setIsFixedVisible(false);
          deltaAccumulatorRef.current = 0;
        } else if (velocity < -0.35) {
          setIsHidden(false);
          // Флаг оставляем только как вспомогательный (без влияния на position)
          setIsFixedVisible(true);
          deltaAccumulatorRef.current = 0;
        } else if (deltaY > 0) {
          // scrolling down, accumulate
          deltaAccumulatorRef.current = Math.max(0, deltaAccumulatorRef.current) + deltaY;
          if (deltaAccumulatorRef.current >= threshold) {
            setIsHidden(true);
            setIsFixedVisible(false);
            deltaAccumulatorRef.current = 0;
          }
        } else if (deltaY < 0) {
          // scrolling up, accumulate
          deltaAccumulatorRef.current = Math.min(0, deltaAccumulatorRef.current) + deltaY;
          if (Math.abs(deltaAccumulatorRef.current) >= threshold) {
            setIsHidden(false);
            setIsFixedVisible(true);
            deltaAccumulatorRef.current = 0;
          }
        }
      }

      // Always update last Y to capture fine movements
      lastScrollYRef.current = currentY;
      lastTimeRef.current = now;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    };

    lastScrollYRef.current = window.scrollY || 0;
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Измеряем текущую высоту хедера для spacer (учитывает responsive/скролл состояния)
  useEffect(() => {
    const measure = () => {
      if (headerRef.current) {
        const h = headerRef.current.offsetHeight || 0;
        if (h !== measuredHeight) setMeasuredHeight(h);
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measuredHeight, isScrolled]);

  // Загружаем скрипты Bitrix и получаем информацию о пользователе
  useEffect(() => {
    const initAuth = async () => {
      // Если используем моки, симулируем аутентификацию
      if (useMocks) {
        console.log("Using mocked authentication");
        await new Promise(resolve => setTimeout(resolve, 300));
        setIsAuthenticated(false);
        setUserId(null);
        return;
      }

      console.log("Bitrix Auth init...");
      try {
        const isAuth = await isUserAuthenticated();
        setIsAuthenticated(isAuth);
        
        if (isAuth) {
          const id = await getCurrentUserId();
          setUserId(id);
        } else {
          setUserId(null);
        }
      } catch (error) {
        console.error("Failed to initialize authentication:", error);
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    initAuth();
  }, [useMocks]);

  // Обработчик открытия/закрытия мобильного меню
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const openContactsModal = useCallback(() => {
    setIsContactsModalOpen(true);
    setIsMobileMenuOpen(false); // Close mobile menu when opening modal
  }, []);

  const closeContactsModal = useCallback(() => {
    setIsContactsModalOpen(false);
  }, []);

  // Если произошла ошибка при загрузке корзины, выводим в консоль
  useEffect(() => {
    if (basketError) {
      console.error('Basket load error:', basketError);
    }
  }, [basketError]);

  const spacerHeight = isFixedVisible && !isHidden ? measuredHeight : 0;

  return (
    <>
      <HeaderSpacer aria-hidden="true" $height={spacerHeight} />
      <HeaderContainer ref={headerRef} role="navigation" aria-label="Основной заголовок сайта" $hidden={isHidden} $fixedVisible={isFixedVisible}>
        <MainHeader 
          basketCount={displayBasketCount} 
          isBasketLoading={isBasketLoading}
          toggleMobileMenu={toggleMobileMenu}
          isScrolled={isScrolled}
          onOpenContactsModal={openContactsModal}
        />
        <MobileMenu 
          isOpen={isMobileMenuOpen} 
          onClose={closeMobileMenu}
          isAuthenticated={isAuthenticated}
          basketCount={displayBasketCount}
          onOpenContactsModal={openContactsModal}
        />
        <ContactsModal
          isOpen={isContactsModalOpen}
          onClose={closeContactsModal}
        />
      </HeaderContainer>
    </>
  );
};

export default Header;