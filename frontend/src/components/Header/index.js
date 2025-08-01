import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import MainHeader from './MainHeader';
import MobileMenu from './MobileMenu';
import ContactsModal from '../modals/ContactsModal';
import { loadBitrixCore, isUserAuthenticated, getCurrentUserId, getUserInfo } from '../../lib/auth';
import { ANIMATION, HEADER_SIZES } from './styles';
import { useBasketCount } from '../../hooks/useBasket';

// Контейнер заголовка
const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background-color: var(--header-bg-color, white);
  transition: background-color ${ANIMATION.duration} ${ANIMATION.timing};
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
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <HeaderContainer role="navigation" aria-label="Основной заголовок сайта">
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
  );
};

export default Header;