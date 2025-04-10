import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';

import { TextLink } from './common';
import { SearchIcon, CartIcon, MenuBurgerIcon } from './icons';
import {
  HEADER_COLORS,
  Container,
  ButtonStyles,
  badgeStyles,
  LogoStyles,
  HeaderIconStyles,
  mediaQuery,
  HEADER_SIZES,
  HEADER_SPACING,
  ANIMATION,
  SHADOWS
} from './styles';
import { NAV_LINKS_DESKTOP, NavLinkPropTypes } from './config';
import { COLORS, TYPOGRAPHY } from '../../styles/tokens';

// --- Стили ---

const MainHeaderWrapper = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  height: ${HEADER_SIZES.headerHeight};
  background-color: ${HEADER_COLORS.light};
  border-bottom: 1px solid ${HEADER_COLORS.lightGray};
  box-shadow: ${SHADOWS.sm};
`;

const MainHeaderContent = styled(Container)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;

  ${mediaQuery.min.lg} {
    justify-content: center;
    gap: 55px; 
  }
`;

// Блок для лого (прямоугольной формы с красным фоном)
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${COLORS.primary};
  width: 200px;
  height: 80px;
  flex-shrink: 0;
  cursor: pointer;
  transition: background-color ${ANIMATION.duration} ${ANIMATION.timing};
  
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  
  img {
    width: auto;
    height: auto;
    max-width: 44px;
    max-height: 44px;
    transition: transform ${ANIMATION.duration} ${ANIMATION.timing};
  }
  
  &:hover {
    background-color: ${COLORS.primaryHover};
    
    img {
      transform: scale(1.05);
    }
  }
`;

const HeaderNavItem = styled.span`
  position: relative;
  font-size: ${TYPOGRAPHY.size.xl}; /* 24px из Figma */
  font-weight: ${TYPOGRAPHY.weight.semiBold}; /* 600 из Figma */
  color: ${COLORS.black};
  cursor: pointer;
  transition: color ${ANIMATION.duration} ${ANIMATION.timing};
  padding: 17px 10px; /* Паддинг из Figma */
  height: 70px; /* Высота соответствует Figma */
  display: flex;
  align-items: center;
  justify-content: center;

  /* Уголок в правом нижнем углу при наведении (по Figma) */
  &::after {
    content: '';
    position: absolute;
    bottom: 5px;
    right: 0;
    width: 100%; /* Вся ширина родителя */
    height: 3px; /* Толщина горизонтальной линии */
    background: ${COLORS.gray400};
    opacity: 0;
    transition: opacity ${ANIMATION.duration} ${ANIMATION.timing};
  }

  &::before {
    content: '';
    position: absolute;
    bottom: 5px;
    right: 0;
    width: 3px; /* Толщина вертикальной линии */
    height: 80%; /* Вся высота родителя */
    background: ${COLORS.gray400};
    opacity: 0;
    transition: opacity ${ANIMATION.duration} ${ANIMATION.timing};
  }

&:hover::before,
&:hover::after {
  opacity: 1;
}

/* При наведении */
&:hover::after {
  opacity: 1;
}

  &:hover, &.active {

    
    &::after {
      opacity: 1;
    }
  }

  ${mediaQuery.max.lg} {
    display: none;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${HEADER_SPACING.regular};

  ${mediaQuery.max.sm} {
    gap: ${HEADER_SPACING.medium};
  }
`;

const ActionButton = styled.button`
  ${ButtonStyles}
  position: relative;
  padding: 17px 10px; /* Соответствует паддингу из Figma */
  margin: 0;
  color: ${HEADER_COLORS.dark};
  
  ${HeaderIconStyles} {
    width: 24px; /* Точный размер из Figma */
    height: 24px;
  }

  ${mediaQuery.hover} {
    &:hover:not(:disabled) {
      color: ${HEADER_COLORS.primary};
    }
  }

  &:focus-visible {
    color: ${HEADER_COLORS.primary};
    outline-offset: 1px;
  }
`;

const CartLink = styled(ActionButton).attrs({ as: 'a' })``;

const CartCounter = styled.span`
  ${badgeStyles}
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background-color: ${COLORS.primary};
  color: ${COLORS.white};
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MobileMenuButton = styled(ActionButton)`
  display: none;

  ${mediaQuery.max.lg} {
    display: inline-flex;
  }
`;

// Индикатор загрузки для корзины
const LoadingIndicator = styled.span`
  position: absolute;
  top: -5px;
  right: -8px;
  width: 8px;
  height: 8px;
  background-color: ${HEADER_COLORS.info};
  border-radius: 50%;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(25, 118, 210, 0.7);
    }
    
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 6px rgba(25, 118, 210, 0);
    }
    
    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(25, 118, 210, 0);
    }
  }
`;

// --- Компонент ---

const MainHeader = ({ 
  basketCount = 0, 
  isBasketLoading = false, 
  toggleMobileMenu
}) => {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push('/search');
  };

  const isActive = (path) => {
    return router.pathname === path || (path !== '/' && router.pathname.startsWith(path));
  };

  const getBasketAriaLabel = () => {
    if (isBasketLoading) {
      return "Корзина, загрузка";
    }
    let label = "Корзина";
    if (basketCount > 0) {
      label += `, ${basketCount} товар`;
      if (basketCount % 10 >= 2 && basketCount % 10 <= 4 && (basketCount % 100 < 10 || basketCount % 100 >= 20)) {
        label += 'а';
      } else if (basketCount !== 1 && basketCount % 10 !== 1) {
        label += 'ов';
      }
    }
    return label;
  };

  return (
    <MainHeaderWrapper>
      <MainHeaderContent>
        <ActionButton onClick={handleSearchClick} aria-label="Открыть поиск" title="Поиск">
          <HeaderIconStyles>
            <SearchIcon />
          </HeaderIconStyles>
        </ActionButton>

        <HeaderNavItem
          className={isActive('/catalog') ? 'active' : ''}
          onClick={() => router.push('/catalog')}
        >
          Каталог
        </HeaderNavItem>

        <HeaderNavItem
          className={isActive('/brands') ? 'active' : ''}
          onClick={() => router.push('/brands')}
        >
          Бренды
        </HeaderNavItem>

        <LogoWrapper>
          <Link href="/" passHref legacyBehavior>
            <a aria-label="Shop4Shoot - Перейти на главную">
              <img src="/images/header/logo-icon.svg" alt="Shop4Shoot"/>
            </a>
          </Link>
        </LogoWrapper>

        <HeaderNavItem
          className={isActive('/about') ? 'active' : ''}
          onClick={() => router.push('/about')}
        >
          О нас
        </HeaderNavItem>

        <HeaderNavItem
          className={isActive('/contacts') ? 'active' : ''}
          onClick={() => router.push('/contacts')}
        >
          Контакты
        </HeaderNavItem>

        <Link href="/cart" passHref legacyBehavior>
          <CartLink aria-label={getBasketAriaLabel()} title="Корзина">
            <HeaderIconStyles>
              <CartIcon />
            </HeaderIconStyles>
            {isBasketLoading ? (
              <LoadingIndicator aria-hidden="true" />
            ) : basketCount > 0 ? (
              <CartCounter aria-hidden="true">
                {basketCount > 99 ? '99+' : basketCount}
              </CartCounter>
            ) : null}
          </CartLink>
        </Link>

        <MobileMenuButton
          onClick={toggleMobileMenu}
          aria-label="Открыть меню навигации"
          title="Меню"
        >
          <HeaderIconStyles>
            <MenuBurgerIcon />
          </HeaderIconStyles>
        </MobileMenuButton>
      </MainHeaderContent>
    </MainHeaderWrapper>
  );
};

MainHeader.propTypes = {
  basketCount: PropTypes.number,
  isBasketLoading: PropTypes.bool,
  toggleMobileMenu: PropTypes.func.isRequired,
};

export default MainHeader;